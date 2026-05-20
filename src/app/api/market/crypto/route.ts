import { NextResponse } from "next/server";

export const revalidate = 60; // 1 menit

// Stablecoin di-exclude dari ranking & movers.
const STABLECOINS = new Set([
  "tether",
  "usd-coin",
  "dai",
  "first-digital-usd",
  "ethena-usde",
  "binance-usd",
  "true-usd",
  "usdd",
  "frax",
  "paxos-standard",
  "gemini-dollar",
  "paypal-usd",
  "ripple-usd",
  "usds",
  "blackrock-usd-institutional-digital-liquidity-fund",
]);

type CGMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: { price: number[] };
};

type CGTrending = {
  coins: Array<{
    item: {
      id: string;
      name: string;
      symbol: string;
      thumb: string;
      market_cap_rank: number | null;
      data?: { price?: number; market_cap?: string; price_change_percentage_24h?: { usd?: number } };
    };
  }>;
};

type CGGlobal = {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
  };
};

type FNG = { data: Array<{ value: string; value_classification: string }> };

// Trending market_cap dari CoinGecko berupa string "$49,989,433" → angka.
function parseMcap(s?: string): number | null {
  if (!s) return null;
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

const mover = (c: CGMarket) => ({
  id: c.id,
  symbol: c.symbol.toUpperCase(),
  name: c.name,
  image: c.image,
  price: c.current_price,
  change24h: c.price_change_percentage_24h_in_currency ?? 0,
  rank: c.market_cap_rank,
});

export async function GET() {
  try {
    const [marketsRes, trendingRes, globalRes, fngRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d",
        { next: { revalidate: 60 } }
      ),
      fetch("https://api.coingecko.com/api/v3/search/trending", { next: { revalidate: 60 } }),
      fetch("https://api.coingecko.com/api/v3/global", { next: { revalidate: 60 } }),
      fetch("https://api.alternative.me/fng/?limit=1", { next: { revalidate: 300 } }),
    ]);

    if (!marketsRes.ok) throw new Error("CoinGecko markets error");

    const markets = (await marketsRes.json()) as CGMarket[];
    const nonStable = markets.filter((c) => !STABLECOINS.has(c.id));

    const top = nonStable.slice(0, 10).map((c) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      change7d: c.price_change_percentage_7d_in_currency ?? 0,
      marketCap: c.market_cap ?? null,
      spark: c.sparkline_in_7d?.price ?? [],
    }));

    // Gainers & losers 24h — dari top 100 by market cap (hindari micro-cap junk).
    const byChange = [...nonStable].filter((c) => typeof c.price_change_percentage_24h_in_currency === "number");
    const gainers = [...byChange]
      .sort((a, b) => (b.price_change_percentage_24h_in_currency ?? 0) - (a.price_change_percentage_24h_in_currency ?? 0))
      .slice(0, 5)
      .map(mover);
    const losers = [...byChange]
      .sort((a, b) => (a.price_change_percentage_24h_in_currency ?? 0) - (b.price_change_percentage_24h_in_currency ?? 0))
      .slice(0, 5)
      .map(mover);

    let trending: Array<{ id: string; symbol: string; name: string; thumb: string; rank: number | null; price: number | null; change24h: number; marketCap: number | null }> = [];
    if (trendingRes.ok) {
      const t = (await trendingRes.json()) as CGTrending;
      trending = t.coins.slice(0, 10).map((x) => ({
        id: x.item.id,
        symbol: x.item.symbol.toUpperCase(),
        name: x.item.name,
        thumb: x.item.thumb,
        rank: x.item.market_cap_rank,
        price: x.item.data?.price ?? null,
        change24h: x.item.data?.price_change_percentage_24h?.usd ?? 0,
        marketCap: parseMcap(x.item.data?.market_cap),
      }));
    }

    let global: {
      totalMcap: number;
      vol24h: number;
      btcDom: number;
      ethDom: number;
      mcapChange24h: number;
      activeCoins: number;
    } | null = null;
    if (globalRes.ok) {
      const g = (await globalRes.json()) as CGGlobal;
      global = {
        totalMcap: g.data.total_market_cap.usd,
        vol24h: g.data.total_volume.usd,
        btcDom: g.data.market_cap_percentage.btc,
        ethDom: g.data.market_cap_percentage.eth,
        mcapChange24h: g.data.market_cap_change_percentage_24h_usd,
        activeCoins: g.data.active_cryptocurrencies,
      };
    }

    let fearGreed: { value: number; classification: string } | null = null;
    if (fngRes.ok) {
      const f = (await fngRes.json()) as FNG;
      const row = f.data?.[0];
      if (row) fearGreed = { value: Number(row.value), classification: row.value_classification };
    }

    return NextResponse.json({ top, trending, gainers, losers, global, fearGreed });
  } catch {
    return NextResponse.json(
      { top: [], trending: [], gainers: [], losers: [], global: null, fearGreed: null, error: "unavailable" },
      { status: 503 }
    );
  }
}
