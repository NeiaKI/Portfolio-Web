import { NextResponse } from "next/server";
import { fetchQuotes, flag, type Quote } from "@/lib/market";

export const revalidate = 120; // 2 menit

const ASIA = [
  { symbol: "^N225", name: "Nikkei 225 (JP)", cc: "jp" },
  { symbol: "^HSI", name: "Hang Seng (HK)", cc: "hk" },
  { symbol: "^KS11", name: "KOSPI (KR)", cc: "kr" },
  { symbol: "^STI", name: "Straits Times (SG)", cc: "sg" },
  { symbol: "^NSEI", name: "Nifty 50 (IN)", cc: "in" },
];

const EUROPE = [
  { symbol: "^FTSE", name: "FTSE 100 (UK)", cc: "gb" },
  { symbol: "^GDAXI", name: "DAX (DE)", cc: "de" },
  { symbol: "^FCHI", name: "CAC 40 (FR)", cc: "fr" },
  { symbol: "^STOXX50E", name: "Euro Stoxx 50", cc: "eu" },
];

const FLAG_BY_SYMBOL = new Map([...ASIA, ...EUROPE].map((e) => [e.symbol, e.cc]));
const withFlags = (quotes: Quote[]) =>
  quotes.map((q) => ({ ...q, logo: FLAG_BY_SYMBOL.has(q.symbol) ? flag(FLAG_BY_SYMBOL.get(q.symbol)!) : null }));

export async function GET() {
  const [asia, europe] = await Promise.all([fetchQuotes(ASIA, true), fetchQuotes(EUROPE, true)]);
  return NextResponse.json({ asia: withFlags(asia), europe: withFlags(europe) });
}
