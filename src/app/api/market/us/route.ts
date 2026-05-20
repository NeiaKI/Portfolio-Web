import { NextResponse } from "next/server";
import { fetchQuotes, flag } from "@/lib/market";

export const revalidate = 120; // 2 menit

const US_INDICES = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^NDX", name: "Nasdaq 100" },
];

// Top 10 saham AS by market cap (kira-kira). domain dipakai untuk logo perusahaan.
const US_STOCKS = [
  { symbol: "AAPL", name: "Apple", domain: "apple.com" },
  { symbol: "MSFT", name: "Microsoft", domain: "microsoft.com" },
  { symbol: "NVDA", name: "NVIDIA", domain: "nvidia.com" },
  { symbol: "GOOGL", name: "Alphabet (Google)", domain: "abc.xyz" },
  { symbol: "AMZN", name: "Amazon", domain: "amazon.com" },
  { symbol: "META", name: "Meta Platforms", domain: "meta.com" },
  { symbol: "AVGO", name: "Broadcom", domain: "broadcom.com" },
  { symbol: "TSLA", name: "Tesla", domain: "tesla.com" },
  { symbol: "BRK-B", name: "Berkshire Hathaway", domain: "berkshirehathaway.com" },
  { symbol: "LLY", name: "Eli Lilly", domain: "lilly.com" },
];

const logoUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
const DOMAIN_BY_SYMBOL = new Map(US_STOCKS.map((s) => [s.symbol, s.domain]));

export async function GET() {
  const [indexQuotes, quotes] = await Promise.all([
    fetchQuotes(US_INDICES),
    fetchQuotes(US_STOCKS),
  ]);

  const indices = indexQuotes.map((q) => ({ ...q, logo: flag("us") }));
  const stocks = quotes.map((q) => {
    const domain = DOMAIN_BY_SYMBOL.get(q.symbol);
    return { ...q, logo: domain ? logoUrl(domain) : null };
  });

  return NextResponse.json({ indices, stocks });
}
