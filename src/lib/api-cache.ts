import "server-only";
import type { Json } from "@/types/database";

const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && !!key && url !== "https://placeholder.supabase.co";
}

function isAdminConfigured(): boolean {
  return isSupabaseConfigured() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export async function getCached<T>(key: string): Promise<T | null> {
  const now = Date.now();

  const mem = memoryCache.get(key);
  if (mem && mem.expiresAt > now) return mem.data as T;
  if (mem) memoryCache.delete(key);

  if (!isSupabaseConfigured()) return null;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("api_cache")
      .select("data, expires_at")
      .eq("key", key)
      .single();

    const row = data as { data: Json; expires_at: string } | null;
    if (!row) return null;

    if (new Date(row.expires_at).getTime() <= now) return null;

    memoryCache.set(key, { data: row.data, expiresAt: new Date(row.expires_at).getTime() });
    return row.data as T;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  memoryCache.set(key, { data, expiresAt });

  // Writes ke api_cache butuh bypass RLS → pakai admin (service_role) client.
  if (!isAdminConfigured()) return;

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("api_cache") as any).upsert(
      {
        key,
        data: data as unknown as Json,
        expires_at: new Date(expiresAt).toISOString(),
      },
      { onConflict: "key" }
    );
  } catch {
    // Silent fail — memory cache still works
  }
}

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await setCached(key, fresh, ttlSeconds);
  return fresh;
}
