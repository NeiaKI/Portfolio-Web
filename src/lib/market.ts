// Helper untuk Yahoo Finance chart API (gratis, tanpa API key).
// Dipakai oleh /api/market/us dan /api/market/id.

export type Quote = {
  symbol: string;
  name: string;
  price: number;
  change7d: number;  // persen, vs close 7 hari lalu
  change24h: number; // persen, vs close hari sebelumnya
  currency: string;
  spark: number[]; // close harian 7 hari terakhir
  logo?: string | null;
};

// Bendera negara via flagcdn (cc = ISO country code: "id", "us", "jp", dll).
export const flag = (cc: string) => `https://flagcdn.com/w40/${cc}.png`;

type YahooChart = {
  chart: {
    result: Array<{
      meta: { regularMarketPrice: number; currency: string; symbol: string; shortName?: string; longName?: string };
      indicators: { quote: Array<{ close: (number | null)[] }> };
    }> | null;
    error: unknown;
  };
};

export async function fetchQuote(symbol: string, fallbackName: string, preferProvidedName = false): Promise<Quote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=7d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as YahooChart;
    const result = json.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const closes = (result.indicators?.quote?.[0]?.close ?? []).filter(
      (c): c is number => c != null
    );

    const price = meta.regularMarketPrice;
    const first = closes[0] ?? price;
    const change7d = first ? ((price - first) / first) * 100 : 0;

    // 24h: harga sekarang vs close hari sebelumnya (elemen kedua-dari-akhir).
    const prevDay = closes.length >= 2 ? closes[closes.length - 2] : first;
    const change24h = prevDay ? ((price - prevDay) / prevDay) * 100 : 0;

    // Yahoo shortName kadang punya padding/junk (mis. "DAX           P") — bersihkan.
    // preferProvidedName: paksa pakai nama custom (forex/komoditas/dll yang Yahoo-nya jelek).
    const rawName = preferProvidedName ? fallbackName : meta.shortName ?? meta.longName ?? fallbackName;
    const name = rawName.replace(/\s{2,}.*$/, "").trim() || fallbackName;

    return {
      symbol: meta.symbol ?? symbol,
      name,
      price,
      change7d,
      change24h,
      currency: meta.currency ?? "USD",
      spark: closes.length ? [...closes, price] : [price],
    };
  } catch {
    return null;
  }
}

// Map dengan batas konkurensi — hindari burst puluhan request Yahoo sekaligus
// (mengurangi risiko rate-limit saat cache miss / cold start).
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

export async function fetchQuotes(
  entries: { symbol: string; name: string }[],
  preferProvidedName = false
): Promise<Quote[]> {
  const results = await mapLimit(entries, 5, (e) => fetchQuote(e.symbol, e.name, preferProvidedName));
  return results.filter((q): q is Quote => q !== null);
}
