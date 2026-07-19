import { NextResponse } from "next/server";
import { fetchQuotes, flag } from "@/lib/market";

export const revalidate = 120; // 2 menit (harga)

// ETF dikelompokkan dalam 4 kategori.
// cc     = ISO country code untuk bendera listing (dipakai di kategori).
// issuer = domain penerbit untuk logo perusahaan (dipakai di Top 10).
// Ticker Eropa (LSE) pakai suffix ".L" agar dikenali Yahoo Finance.
type EtfDef = { symbol: string; name: string; cc: string; issuer: string };

const ETF_CATEGORIES: { key: string; en: string; id: string; items: EtfDef[] }[] = [
  {
    key: "halal",
    en: "Halal ETF",
    id: "ETF Halal",
    items: [
      { symbol: "SPUS", name: "SP Funds S&P 500 Sharia", cc: "us", issuer: "spfunds.us" },
      { symbol: "HLAL", name: "Wahed FTSE USA Shariah", cc: "us", issuer: "wahedinvest.com" },
      { symbol: "IGDA.L", name: "Invesco Dow Jones Islamic Global", cc: "ie", issuer: "invesco.com" },
      { symbol: "ISDU.L", name: "iShares MSCI USA Islamic", cc: "ie", issuer: "ishares.com" },
    ],
  },
  {
    key: "sp500",
    en: "S&P 500 ETF",
    id: "ETF S&P 500",
    items: [
      { symbol: "VOO", name: "Vanguard S&P 500", cc: "us", issuer: "vanguard.com" },
      { symbol: "SPY", name: "SPDR S&P 500 Trust", cc: "us", issuer: "ssga.com" },
      { symbol: "CSPX.L", name: "iShares Core S&P 500", cc: "ie", issuer: "ishares.com" },
      { symbol: "VUAG.L", name: "Vanguard S&P 500 (Acc)", cc: "ie", issuer: "vanguard.com" },
    ],
  },
  {
    key: "tech",
    en: "Technology & AI ETF",
    id: "ETF Teknologi & AI",
    items: [
      { symbol: "QQQ", name: "Invesco QQQ Trust", cc: "us", issuer: "invesco.com" },
      { symbol: "SCHG", name: "Schwab US Large-Cap Growth", cc: "us", issuer: "schwab.com" },
      { symbol: "VGT", name: "Vanguard Information Technology", cc: "us", issuer: "vanguard.com" },
      { symbol: "CNDX.L", name: "iShares Nasdaq 100", cc: "ie", issuer: "ishares.com" },
    ],
  },
  {
    key: "dividend",
    en: "Dividend ETF",
    id: "ETF Dividen",
    items: [
      { symbol: "SCHD", name: "Schwab US Dividend Equity", cc: "us", issuer: "schwab.com" },
      { symbol: "VYM", name: "Vanguard High Dividend Yield", cc: "us", issuer: "vanguard.com" },
      { symbol: "VIG", name: "Vanguard Dividend Appreciation", cc: "us", issuer: "vanguard.com" },
      { symbol: "VHYL.L", name: "Vanguard FTSE All-World High Div", cc: "ie", issuer: "vanguard.com" },
    ],
  },
];

const CC_BY_SYMBOL = new Map(
  ETF_CATEGORIES.flatMap((c) => c.items.map((e) => [e.symbol, e.cc] as const))
);
const ISSUER_BY_SYMBOL = new Map(
  ETF_CATEGORIES.flatMap((c) => c.items.map((e) => [e.symbol, e.issuer] as const))
);
const issuerLogo = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

// Ambil AUM (net assets) per ETF dari Financial Modeling Prep.
// Untuk ETF, field marketCap FMP setara total net assets/AUM.
// AUM berubah lambat → cache 1 jam supaya hemat kuota API (free tier).
async function fetchAum(symbols: string[]): Promise<Map<string, number>> {
  const key = process.env.FMP_API_KEY;
  const map = new Map<string, number>();
  if (!key) return map; // tanpa key: AUM kosong, harga tetap jalan

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const url = `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${key}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const json = (await res.json()) as Array<{ symbol: string; marketCap: number }>;
        const mcap = json?.[0]?.marketCap;
        return typeof mcap === "number" && mcap > 0 ? ([symbol, mcap] as const) : null;
      } catch {
        return null;
      }
    })
  );

  for (const r of results) if (r) map.set(r[0], r[1]);
  return map;
}

export async function GET() {
  const allDefs = ETF_CATEGORIES.flatMap((c) => c.items);
  const allSymbols = allDefs.map((e) => e.symbol);

  // preferProvidedName: paksa pakai nama custom (nama Yahoo untuk ETF kadang kurang rapi).
  const [quotes, aumMap] = await Promise.all([
    fetchQuotes(allDefs, true),
    fetchAum(allSymbols),
  ]);

  const quoteBySymbol = new Map(quotes.map((q) => [q.symbol, q]));

  const categories = ETF_CATEGORIES.map((cat) => ({
    key: cat.key,
    en: cat.en,
    id: cat.id,
    items: cat.items
      .map((def) => {
        // Yahoo kadang mengembalikan simbol tanpa suffix; cocokkan via nama def.
        const q = quoteBySymbol.get(def.symbol);
        if (!q) return null;
        return {
          ...q,
          symbol: def.symbol,
          name: def.name,
          logo: flag(CC_BY_SYMBOL.get(def.symbol) ?? "us"),
          aum: aumMap.get(def.symbol) ?? null,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
  }));

  // Top 10 ETF global berdasarkan AUM (gabung semua kategori, dedup, urut AUM desc).
  const seen = new Set<string>();
  const top = categories
    .flatMap((c) => c.items)
    .filter((e) => {
      if (seen.has(e.symbol)) return false;
      seen.add(e.symbol);
      return true;
    })
    .filter((e) => e.aum != null)
    .sort((a, b) => (b.aum ?? 0) - (a.aum ?? 0))
    .slice(0, 10)
    // Top 10 pakai logo perusahaan penerbit (bukan bendera).
    .map((e) => ({ ...e, logo: issuerLogo(ISSUER_BY_SYMBOL.get(e.symbol) ?? "") }));

  return NextResponse.json({ top, categories });
}
