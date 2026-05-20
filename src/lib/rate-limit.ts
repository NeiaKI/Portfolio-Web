const store = new Map<string, { count: number; reset: number }>();

// Purge expired entries setiap 5 menit — mencegah unbounded memory growth
// saat server menerima banyak IP unik (misal traffic spike / scan)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.reset) store.delete(key);
  }
}, 5 * 60 * 1000);

// Hanya terima value yang berbentuk IP (IPv4/IPv6). Mencegah key rate-limit
// dipenuhi string sembarang dari header yang dipalsukan → membatasi ruang key.
// Catatan: X-Forwarded-For tetap bisa dipalsukan tanpa proxy tepercaya yang
// menormalisasinya; saat di-deploy, andalkan CDN/proxy yang menimpa header ini.
const IP_RE = /^[0-9a-fA-F:.]{3,45}$/;

export function getClientIp(req: { headers: Headers }): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first && IP_RE.test(first)) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real && IP_RE.test(real)) return real;
  return "unknown";
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
