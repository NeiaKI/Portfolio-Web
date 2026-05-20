import { NextResponse } from "next/server";
import { fetchQuotes } from "@/lib/market";

export const revalidate = 120; // 2 menit

// Komoditas tidak punya logo perusahaan — pakai emoji sebagai ikon.
const COMMODITIES = [
  { symbol: "GC=F", name: "Gold (Emas)", emoji: "🥇" },
  { symbol: "SI=F", name: "Silver (Perak)", emoji: "🥈" },
  { symbol: "CL=F", name: "Crude Oil WTI", emoji: "🛢️" },
  { symbol: "BZ=F", name: "Brent Crude Oil", emoji: "🛢️" },
  { symbol: "NG=F", name: "Natural Gas", emoji: "🔥" },
];

const EMOJI_BY_SYMBOL = new Map(COMMODITIES.map((c) => [c.symbol, c.emoji]));

export async function GET() {
  const quotes = await fetchQuotes(COMMODITIES, true);
  const items = quotes.map((q) => ({ ...q, emoji: EMOJI_BY_SYMBOL.get(q.symbol) ?? null }));
  return NextResponse.json({ items });
}
