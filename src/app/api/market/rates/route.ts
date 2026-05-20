import { NextResponse } from "next/server";
import { fetchQuotes, flag } from "@/lib/market";

export const revalidate = 120; // 2 menit

// US Treasury yields — angka = persen yield (bukan harga).
const TREASURY = [
  { symbol: "^IRX", name: "US 13-Week T-Bill" },
  { symbol: "^FVX", name: "US 5-Year Treasury" },
  { symbol: "^TNX", name: "US 10-Year Treasury" },
  { symbol: "^TYX", name: "US 30-Year Treasury" },
];

export async function GET() {
  const [treasuryQuotes, vixQuotes] = await Promise.all([
    fetchQuotes(TREASURY, true),
    fetchQuotes([{ symbol: "^VIX", name: "VIX (Volatility)" }], true),
  ]);
  const treasury = treasuryQuotes.map((q) => ({ ...q, logo: flag("us") }));
  const vix = vixQuotes[0] ? { ...vixQuotes[0], logo: flag("us") } : null;
  return NextResponse.json({ treasury, vix });
}
