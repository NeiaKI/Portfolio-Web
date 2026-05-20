import { NextResponse } from "next/server";
import { fetchQuotes, flag } from "@/lib/market";

export const revalidate = 120; // 2 menit

const PAIRS = [
  { symbol: "IDR=X", name: "USD / IDR", cc: "id" },
  { symbol: "EURUSD=X", name: "EUR / USD", cc: "eu" },
  { symbol: "JPY=X", name: "USD / JPY", cc: "jp" },
  { symbol: "GBPUSD=X", name: "GBP / USD", cc: "gb" },
  { symbol: "USDCNY=X", name: "USD / CNY", cc: "cn" },
  { symbol: "SGDIDR=X", name: "SGD / IDR", cc: "sg" },
];

const FLAG_BY_SYMBOL = new Map(PAIRS.map((p) => [p.symbol, p.cc]));

export async function GET() {
  const quotes = await fetchQuotes(PAIRS, true);
  const pairs = quotes.map((q) => {
    const cc = FLAG_BY_SYMBOL.get(q.symbol);
    return { ...q, logo: cc ? flag(cc) : null };
  });
  return NextResponse.json({ pairs });
}
