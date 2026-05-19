const store = new Map<string, { count: number; reset: number }>();

// Purge expired entries setiap 5 menit — mencegah unbounded memory growth
// saat server menerima banyak IP unik (misal traffic spike / scan)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.reset) store.delete(key);
  }
}, 5 * 60 * 1000);

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
