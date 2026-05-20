import { NextResponse } from "next/server";

export const revalidate = 60; // 1 menit

// Stablecoin di-exclude dari "top 10" (id CoinGecko).
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

// Trending market_cap dari CoinGecko berupa string "$49,989,433" → angka.
function parseMcap(s?: string): number | null {
  if (!s) return null;
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function GET() {
  try {
    const [marketsRes, trendingRes] = await Promise.all([
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d",
        { next: { revalidate: 60 } }
      ),
      fetch("https://api.coingecko.com/api/v3/search/trending", { next: { revalidate: 60 } }),
    ]);

    if (!marketsRes.ok) throw new Error("CoinGecko markets error");

    const markets = (await marketsRes.json()) as CGMarket[];
    const top = markets
      .filter((c) => !STABLECOINS.has(c.id))
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        symbol: c.symbol.toUpperCase(),
        name: c.name,
        image: c.image,
        price: c.current_price,
        change7d: c.price_change_percentage_7d_in_currency ?? 0,
        marketCap: c.market_cap ?? null,
        spark: c.sparkline_in_7d?.price ?? [],
      }));

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

    return NextResponse.json({ top, trending });
  } catch {
    return NextResponse.json({ top: [], trending: [], error: "unavailable" }, { status: 503 });
  }
}
