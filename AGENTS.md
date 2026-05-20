<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ekiportfolio — Portfolio Web v2

Personal portfolio site — bilingual, Supabase-backed, Catppuccin-themed.  
Built with **Next.js 16.2.6**, Tailwind v4, shadcn/ui, MDX blog, Bun.

## Quick start
```sh
npm run dev      # start dev server on :3000
npm run build    # prebuild (bump SW version) + next build
npm run start    # start production server
```
- No lint/typecheck/test scripts exist. Run `tsc --noEmit` manually if needed.
- No CI pipeline (no `.github/`).

## Architecture

### Routing & i18n
- **Next.js App Router** with locale prefix `as-needed`.
  - `/` redirects to `/en` (root page redirect).
  - `/id` for Indonesian, else English.
- `next-intl` v4: messages in `messages/{locale}.json`.
- Import navigation helpers from `@/i18n/navigation`, not from next-intl directly.

### Middleware
- **`src/proxy.ts`** serves as middleware (not `middleware.ts`).
  - Handles both `next-intl/middleware` locale detection AND dynamic CSP nonce generation.
  - CSP is strict: `script-src 'self' 'nonce-{...}' 'strict-dynamic'`, with `'unsafe-eval'` only in dev.
  - Nonce is passed to layout via `x-nonce` header and read with `headers().get("x-nonce")`.
  - Matcher: `["/((?!api|_next|_vercel|.*\\..*).*)"]` — API routes skip middleware.

### Source layout
```
src/
  app/           — App Router pages + API routes
    [locale]/    — bilingual route group
    api/         — all API endpoints (contact, spotify, github, wakatime, views, etc.)
  components/
    ui/          — shadcn/ui components
    layout/      — nav-sidebar, widget-sidebar, mobile-nav, main-layout
    home/        — home page sections (hero, about, experience, skills, etc.)
    blog/        — blog list, share buttons, view count, TOC
    widgets/     — spotify, wakatime, duolingo, monkeytype, weather, clock
    project/     — project card & list components
  lib/           — utilities (blog, data, github, api-cache, rate-limit, supabase, utils)
  i18n/          — next-intl config (routing, navigation, request)
  types/         — Database.ts (Supabase typegen)
  data/          — static certificate data fallback
```

### Data flow
- **Supabase** (optional): if `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` are set, projects/certificates come from Supabase DB.
- **Fallback**: otherwise, projects fetched from GitHub API (cached 15 min) and certificates from `@/data/certificates`.
- **Dual-layer cache** (`lib/api-cache.ts`): in-memory `Map` + Supabase `api_cache` table (needs `SUPABASE_SERVICE_ROLE_KEY` for writes).
- **Rate limit** (`lib/rate-limit.ts`): in-memory `Map`, purges stale entries every 5 min.
  - Applied to contact form endpoint. Keyed by client IP from `x-forwarded-for`.

### CSP (Content Security Policy)
- Generated per-request in `src/proxy.ts` via `buildCSP(nonce)`.
- Image sources include: `i.scdn.co`, `cdn.simpleicons.org`, `avatars.githubusercontent.com`, `opengraph.githubassets.com`, `res.cloudinary.com`, `images.unsplash.com`, `miro.medium.com`, `dev-to-uploads.s3.amazonaws.com`, and more.
- `connect-src` includes `github-contributions-api.jogruber.de` for the GitHub heatmap widget.
- Any new external image/service **must** be added to both `images.remotePatterns` in `next.config.ts` AND the CSP `img-src` directive in `proxy.ts`.

### Supabase migrations
- `supabase/migrations/` — run in order via SQL Editor:
  1. `001_initial_schema.sql` — profile, projects, certificates, api_cache + RLS
  2. `002_certificates_storage.sql` — adds credential_id column, storage bucket + policies
  3. `003_post_views.sql` — post_views table + `increment_post_views(text)` RPC
- Seeds: `seed_projects.sql`, `seed_certificates.sql`
- Storage buckets: `certificates` (10MB, PDF/JPEG/PNG/WebP), `projects` (10MB, images)
- Three Supabase clients:
  - `client.ts` — browser (anon key, RLS)
  - `server.ts` — server component (anon key, RLS via cookie)
  - `admin.ts` — server-only (service_role key, bypasses RLS for cache writes)

### MDX Blog
- Posts in `content/blog/*.mdx` with gray-matter frontmatter.
- `lib/blog.ts` — `getAllPosts()` and `getPostBySlug()`.
- Frontmatter: `title`, `description`, `date`, `tags`, `published`.
- Read time auto-calculated (200 words/min).
- View counter via `/api/views/[slug]` → Supabase RPC `increment_post_views(text)`.

### App quirks
- `prebuild` script bumps service worker cache version (`scripts/bump-sw-version.js`).
- `overrides: { "postcss": ">=8.5.10" }` pins postcss version.
- `ignoreScripts` + `trustedDependencies` both include `sharp` and `unrs-resolver`.
- Theme: dark by default (class `dark` on `<html>`), toggled via localStorage.
- Vim `j`/`k` scrolling wired globally in `<VimKeys>` component inside `Providers`.
- SVG icon at `/icon.svg` for browser tab.
- RSS feed at `/feed.xml`, generated by `src/app/feed.xml/route.ts`.
- OG images generated dynamically per route (blog, project, certificates all have `opengraph-image.tsx`).
- Default OG image from `src/app/opengraph-image/route.tsx`.

### External services (API routes)
| Route | Service | Config |
|-------|---------|--------|
| `/api/contact` | Web3Forms (rate-limited per IP) | `WEB3FORMS_ACCESS_KEY` |
| `/api/spotify` | Spotify Now Playing | `SPOTIFY_CLIENT_ID`, `_SECRET`, `_REFRESH_TOKEN` |
| `/api/wakatime` | WakaTime stats | `WAKATIME_API_KEY` |
| `/api/github` | GitHub profile | `GITHUB_TOKEN` (read-only) |
| `/api/views/[slug]` | Post view counter | Supabase RPC |
| `/api/og` | Dynamic OG image | — |

### Icons & styling
- shadcn/ui base-nova style, lucide-react icons, `@base-ui/react` for primitives.
- `components.json` at project root — aliases: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`.
- `cn()` utility from `tailwind-merge` + `clsx` in `lib/utils.ts`.
- Tailwind v4 via `@tailwindcss/postcss` PostCSS plugin (not `tailwind.config.ts`).
- CSS animation via `tw-animate-css`.
