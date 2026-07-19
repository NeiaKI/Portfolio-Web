# syntax=docker/dockerfile:1

# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder

# sharp butuh libvips & (di Alpine) perlu build tool saat install optional deps.
# unrs-resolver perlu build tools native. Install sekaligus di sini.
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy manifest dulu untuk memaksimalkan cache layer.
COPY package.json ./

# Install semua dependency (termasuk dev, karena butuh untuk `next build`).
# ignoreScripts/trustedDependencies sudah di-set di package.json (sharp, unrs-resolver).
RUN npm install

# Copy sisa source.
COPY . .

# prebuild (bump SW version) otomatis jalan sebelum `next build` via npm script.
RUN npm run build

# ---------- Stage 2: runner ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Next.js membaca PORT; Coolify biasanya inject 3000 atau port yang di-map.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Jalankan sebagai non-root.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Hanya copy hasil build + file runtime yang dibutuhkan `next start`.
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

# `next start` default jalan di PORT (3000) dan bind ke HOSTNAME.
CMD ["npm", "run", "start"]
