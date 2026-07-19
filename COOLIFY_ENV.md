# Coolify Environment Variables

Panduan env untuk resource **Docker Compose** di Coolify.
Isi semua di **Coolify UI → Environment / Secrets** (jangan hardcode di `docker-compose.yml`).

## Cara isi di Coolify
1. Buka project → Resource → tab **Environment**.
2. Add variable satu per satu (atau paste sebagai `.env` block).
3. Centang **"Is Build Variable"** untuk yang dibutuhkan saat build (tidak ada di kasus ini — semua runtime).
4. Secret sensitif (service role) → centang **"Secret" / masked**.

## Variables

| Key | Wajib | Keterangan | Contoh / Sumber |
|-----|-------|-----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL project Supabase | `https://nkhyfwjjwiouatbweafh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Publishable key (client-safe) | `sb_publishable_...` (dari Supabase Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ | Tulis `api_cache`. **Regenerate dulu** (pernah bocor). Server-only. | Supabase Settings → API → `service_role` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical URL produksi | `https://domain-anda.com` |
| `FMP_API_KEY` | ✅ | AUM ETF (top 10) | dashboard.fmpcloud.io |
| `WEB3FORMS_ACCESS_KEY` | ✅ | Form kontak | web3forms.com |
| `SPOTIFY_CLIENT_ID` | ⚠️ | Widget Spotify (opsional) | Spotify Dev Dashboard |
| `SPOTIFY_CLIENT_SECRET` | ⚠️ | Spotify (opsional) | Spotify Dev Dashboard |
| `SPOTIFY_REFRESH_TOKEN` | ⚠️ | Spotify (opsional) | generate via OAuth |
| `WAKATIME_API_KEY` | ⚠️ | Widget WakaTime (opsional) | wakatime.com → settings → API key |
| `GITHUB_TOKEN` | ⚠️ | Fallback data proyek (read-only) | github.com → settings → tokens |
| `BRILLIANT_STREAK` | ⚠️ | Streak Brilliant (manual) | Angka, mis. `42` |
| `BRILLIANT_TOTAL_XP` | ⚠️ | Total XP Brilliant (manual) | Angka, mis. `12500` |
| `BRILLIANT_LESSONS_COMPLETED` | ⚠️ | Lesson Brilliant selesai (manual) | Angka, mis. `87` |
| `BRILLIANT_COURSES_JSON` | ⚠️ | Progres kursus Brilliant (manual) | `[{"title":"Computer Science","progress":65}]` |
| `MEDIUM_USERNAME` | ⚠️ | Default `nateeki` | — |
| `DEVTO_USERNAME` | ⚠️ | Default `nateeki` | — |
| `NEXT_PUBLIC_ETH_ADDRESS` | ⚠️ | Tip ETH (opsional) | — |
| `NEXT_PUBLIC_KOFI_USERNAME` | ⚠️ | Ko-fi (opsional) | — |
| `NEXT_PUBLIC_TRAKTEER_USERNAME` | ⚠️ | Trakteer (opsional) | — |

## Catatan
- `NEXT_PUBLIC_*` dieskspos ke browser → aman untuk key publik (anon/publishable).
- `SUPABASE_SERVICE_ROLE_KEY` **bypass RLS** → jangan prefix `NEXT_PUBLIC_`, jangan commit.
- Tanpa `SUPABASE_SERVICE_ROLE_KEY`, fitur `api_cache` skip tapi app tetap jalan.
- Tanpa `FMP_API_KEY`, tab ETF tetap jalan tapi kolom AUM kosong.
- Tanpa `GITHUB_TOKEN`, proyek fallback ke `src/data` (jika ada).
