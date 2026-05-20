import { NextResponse } from "next/server";
import { fetchQuotes, flag } from "@/lib/market";

export const revalidate = 120; // 2 menit

// Indeks pasar Indonesia (selain IHSG: LQ45, IDX30, Jakarta Islamic Index).
const ID_INDICES = [
  { symbol: "^JKSE", name: "IHSG (Composite)" },
  { symbol: "^JKLQ45", name: "LQ45 (45 saham likuid)" },
  { symbol: "IDX30.JK", name: "IDX30" },
  { symbol: "^JKII", name: "Jakarta Islamic Index" },
];

// Top 10 saham Indonesia by market cap (kira-kira). domain dipakai untuk logo perusahaan.
const ID_STOCKS = [
  { symbol: "BBCA.JK", name: "Bank Central Asia", domain: "bca.co.id" },
  { symbol: "BBRI.JK", name: "Bank Rakyat Indonesia", domain: "bri.co.id" },
  { symbol: "BMRI.JK", name: "Bank Mandiri", domain: "bankmandiri.co.id" },
  { symbol: "TLKM.JK", name: "Telkom Indonesia", domain: "telkom.co.id" },
  { symbol: "ASII.JK", name: "Astra International", domain: "astra.co.id" },
  { symbol: "BBNI.JK", name: "Bank Negara Indonesia", domain: "bni.co.id" },
  { symbol: "TPIA.JK", name: "Chandra Asri", domain: "chandra-asri.com" },
  { symbol: "ICBP.JK", name: "Indofood CBP", domain: "indofoodcbp.com" },
  { symbol: "BRIS.JK", name: "Bank Syariah Indonesia", domain: "bankbsi.co.id" },
  { symbol: "ANTM.JK", name: "Aneka Tambang", domain: "antam.com" },
];

const logoUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
const DOMAIN_BY_SYMBOL = new Map(ID_STOCKS.map((s) => [s.symbol, s.domain]));

export async function GET() {
  const [indexQuotes, quotes] = await Promise.all([
    fetchQuotes(ID_INDICES, true),
    fetchQuotes(ID_STOCKS),
  ]);

  const indices = indexQuotes.map((q) => ({ ...q, logo: flag("id") }));
  const stocks = quotes.map((q) => {
    const domain = DOMAIN_BY_SYMBOL.get(q.symbol);
    return { ...q, logo: domain ? logoUrl(domain) : null };
  });

  return NextResponse.json({ indices, stocks });
}
