#!/usr/bin/env bun
/**
 * Sync ringkasan pemakaian token 30 hari dari DB 9Router ke Supabase.
 *
 * Cara pakai:
 *   bun --env-file=.env.local scripts/sync-9router-usage.js [days]
 *
 * Menghitung per-hari (date_key) lalu upsert ke tabel router_usage.
 * Jalankan terjadwal (cron/systemd timer) — mis. tiap 6 jam via cron.
 */

import { Database } from "bun:sqlite";
import { createClient } from "@supabase/supabase-js";

const DB_PATH =
  process.env.NINE_ROUTER_DB_PATH || `${process.env.HOME || "~"}/.9router/db/data.sqlite`;
const DAYS = Number(process.argv[2] || "30");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[9router-sync] SUPABASE_URL / SERVICE_ROLE_KEY belum diatur di .env.local");
  process.exit(1);
}

const db = new Database(DB_PATH, { readonly: true });

// Agregasi per hari: prompt/completion tokens, cost, jumlah request.
const rows = db
  .query(
    `select
       date(timestamp) as day,
       sum(promptTokens) as prompt_tokens,
       sum(completionTokens) as completion_tokens,
       sum(cost) as cost,
       count(*) as requests
     from usageHistory
     where timestamp >= datetime('now', ?1)
     group by date(timestamp)`
  )
  .all(`-${DAYS} days`);

db.close();

if (rows.length === 0) {
  console.log(`[9router-sync] tidak ada data dalam ${DAYS} hari`);
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

const records = rows.map((r) => ({
  date_key: r.day,
  prompt_tokens: r.prompt_tokens ?? 0,
  completion_tokens: r.completion_tokens ?? 0,
  cost: Number(r.cost ?? 0).toFixed(6),
  requests: r.requests ?? 0,
}));

const { error } = await supabase
  .from("router_usage")
  .upsert(records, { onConflict: "date_key" });

if (error) {
  console.error("[9router-sync] gagal upsert:", error.message);
  process.exit(1);
}

const total = records.reduce(
  (a, r) => ({
    prompt: a.prompt + r.prompt_tokens,
    completion: a.completion + r.completion_tokens,
    cost: a.cost + Number(r.cost),
    requests: a.requests + r.requests,
  }),
  { prompt: 0, completion: 0, cost: 0, requests: 0 }
);

console.log(
  `[9router-sync] OK — ${records.length} hari di-sync (${DAYS}d): ` +
    `${total.requests} request, ${(total.prompt / 1e6).toFixed(1)}M prompt, ` +
    `${(total.completion / 1e6).toFixed(1)}M completion, $${total.cost.toFixed(2)}`
);
