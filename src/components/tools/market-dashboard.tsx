"use client";

import { useEffect, useState } from "react";
import { Bitcoin, TrendingUp, TrendingDown, Flame, LineChart, Building2, DollarSign, Gem, Globe, Landmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "./sparkline";

// Tumpukan batangan logam (stack of bars) — 2 di bawah + 1 di atas. Emas & perak.
function IngotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      {/* baris bawah kiri */}
      <path d="M3.2 14h6.4l1 4H2.2l1-4Z" />
      {/* baris bawah kanan */}
      <path d="M14.4 14h6.4l1 4h-8.4l1-4Z" />
      {/* batang atas (tengah) */}
      <path d="M8.8 7.5h6.4l1 4H7.8l1-4Z" />
    </svg>
  );
}

// Drum minyak 3D — lid elips + lubang bung + ring band, gaya solid glyph.
// fillRule evenodd: garis band/rim & lubang jadi punch-out (tembus ke background).
function OilDrumIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C7.6 2 5 3.4 5 5v14c0 1.6 2.6 3 7 3s7-1.4 7-3V5c0-1.6-2.6-3-7-3Zm-3 2.2a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM5.6 7.6h12.8v0.9H5.6v-0.9Zm0 4.1h12.8v0.9H5.6v-0.9Zm0 4.1h12.8v0.9H5.6v-0.9Z"
      />
    </svg>
  );
}

// Komoditas tak punya logo — pakai ikon berwarna (lebih rapi dari emoji).
const COMMODITY_ICON: Record<string, React.ReactNode> = {
  "GC=F": <IngotIcon className="h-3.5 w-3.5 text-amber-500" />,
  "SI=F": <IngotIcon className="h-3.5 w-3.5 text-slate-400" />,
  "CL=F": <OilDrumIcon className="h-3.5 w-3.5 text-zinc-500" />,
  "BZ=F": <OilDrumIcon className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />,
  "NG=F": <Flame className="h-3.5 w-3.5 text-orange-500" />,
};

type Crypto = { id: string; symbol: string; name: string; image: string; price: number; change7d: number; spark: number[] };
type Trending = { id: string; symbol: string; name: string; thumb: string; rank: number | null };
type Quote = { symbol: string; name: string; price: number; change7d: number; currency: string; spark: number[]; logo?: string | null };

type Commodity = Quote & { emoji?: string | null };

type CryptoResp = { top: Crypto[]; trending: Trending[] };
type UsResp = { indices: Quote[]; stocks: Quote[] };
type IdResp = { indices: Quote[]; stocks: Quote[] };
type ForexResp = { pairs: Quote[] };
type CommodResp = { items: Commodity[] };
type GlobalResp = { asia: Quote[]; europe: Quote[] };
type RatesResp = { treasury: Quote[]; vix: Quote | null };

function fmtUSD(n: number): string {
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
}
function fmtIDR(n: number): string {
  return `Rp${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}
function fmtNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
function fmtForex(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 10) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}
function fmtPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

function Change({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function Section({ icon: Icon, title, subtitle, children }: { icon: typeof Bitcoin; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="h-fit rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <span className="ml-auto text-[11px] text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="divide-y divide-border/40">{children}</div>
    </div>
  );
}

function Row({
  rank,
  img,
  iconEl,
  symbol,
  name,
  price,
  change7d,
  spark,
  showChange = true,
}: {
  rank?: number;
  img?: string | null;
  iconEl?: React.ReactNode;
  symbol: string;
  name: string;
  price: string;
  change7d: number;
  spark?: number[];
  showChange?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      {rank != null && <span className="w-4 shrink-0 text-[11px] text-muted-foreground/60">{rank}</span>}
      {iconEl ? (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">{iconEl}</div>
      ) : img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={name} className="h-6 w-6 shrink-0 rounded-full bg-muted object-contain" loading="lazy" />
      ) : (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
          {symbol.slice(0, 3)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="text-[11px] uppercase text-muted-foreground">{symbol}</p>
      </div>
      {spark && spark.length > 1 && <Sparkline data={spark} positive={change7d >= 0} className="hidden shrink-0 sm:block" />}
      <div className="flex w-28 shrink-0 flex-col items-end">
        <span className="text-sm font-medium tabular-nums text-foreground">{price}</span>
        {showChange && <Change value={change7d} />}
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-2.5 w-10" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

const REFRESH_MS = 60_000; // auto-refresh tiap 60 detik agar page yang kebuka tetap sync

export function MarketDashboard({ locale }: { locale: string }) {
  const [crypto, setCrypto] = useState<CryptoResp | null>(null);
  const [us, setUs] = useState<UsResp | null>(null);
  const [id, setId] = useState<IdResp | null>(null);
  const [forex, setForex] = useState<ForexResp | null>(null);
  const [commod, setCommod] = useState<CommodResp | null>(null);
  const [global, setGlobal] = useState<GlobalResp | null>(null);
  const [rates, setRates] = useState<RatesResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    const getJson = (url: string) => fetch(url).then((r) => r.json()).catch(() => null);

    const load = async () => {
      const [c, u, i, fx, cm, gl, rt] = await Promise.all([
        getJson("/api/market/crypto"),
        getJson("/api/market/us"),
        getJson("/api/market/id"),
        getJson("/api/market/forex"),
        getJson("/api/market/commodities"),
        getJson("/api/market/global"),
        getJson("/api/market/rates"),
      ]);
      if (!active) return;
      setCrypto(c); setUs(u); setId(i); setForex(fx); setCommod(cm); setGlobal(gl); setRates(rt);
      setUpdatedAt(new Date());
      setLoading(false);
    };

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const t = (en: string, idText: string) => (locale === "id" ? idText : en);
  const sevenDay = t("7-day change", "perubahan 7 hari");
  const unavailable = <p className="px-4 py-6 text-center text-xs text-muted-foreground">{t("Unavailable", "Tidak tersedia")}</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        {loading
          ? t("Loading market data…", "Memuat data market…")
          : updatedAt
            ? `${t("Auto-refresh every 60s · updated", "Auto-refresh tiap 60d · diperbarui")} ${updatedAt.toLocaleTimeString(locale === "id" ? "id-ID" : "en-US")}`
            : ""}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
      {/* Crypto Top 10 */}
      <Section icon={Bitcoin} title="Crypto — Top 10" subtitle={sevenDay}>
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)
          : crypto?.top?.length
            ? crypto.top.map((c, i) => (
                <Row key={c.id} rank={i + 1} img={c.image} symbol={c.symbol} name={c.name} price={fmtUSD(c.price)} change7d={c.change7d} spark={c.spark} />
              ))
            : unavailable}
      </Section>

      {/* Crypto Trending 10 */}
      <Section icon={Flame} title={t("Crypto — Trending", "Crypto — Trending")} subtitle={t("top 10", "top 10")}>
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)
          : crypto?.trending?.length
            ? crypto.trending.map((c, i) => (
                <Row key={c.id} rank={i + 1} img={c.thumb} symbol={c.symbol} name={c.name} price={c.rank ? `#${c.rank}` : "—"} change7d={0} showChange={false} />
              ))
            : unavailable}
      </Section>

      {/* US Market */}
      <Section icon={LineChart} title={t("US Market", "Pasar AS")} subtitle={sevenDay}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : (
          <>
            {us?.indices?.map((q) => (
              <Row key={q.symbol} img={q.logo} symbol={q.symbol.replace("^", "")} name={q.name} price={fmtNum(q.price)} change7d={q.change7d} spark={q.spark} />
            ))}
            {us?.stocks?.length
              ? us.stocks.map((q, i) => (
                  <Row key={q.symbol} rank={i + 1} img={q.logo} symbol={q.symbol} name={q.name} price={fmtUSD(q.price)} change7d={q.change7d} spark={q.spark} />
                ))
              : !us?.indices?.length && unavailable}
          </>
        )}
      </Section>

      {/* Indonesia Market */}
      <Section icon={Building2} title={t("Indonesia Market", "Pasar Indonesia")} subtitle={sevenDay}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : id?.indices?.length || id?.stocks?.length ? (
          <>
            {id?.indices?.map((q) => (
              <Row key={q.symbol} img={q.logo} symbol={q.symbol.replace(/[\^]|\.JK/g, "")} name={q.name} price={fmtNum(q.price)} change7d={q.change7d} spark={q.spark} />
            ))}
            {id?.stocks?.map((q, i) => (
              <Row key={q.symbol} rank={i + 1} img={q.logo} symbol={q.symbol.replace(".JK", "")} name={q.name} price={fmtIDR(q.price)} change7d={q.change7d} spark={q.spark} />
            ))}
          </>
        ) : (
          unavailable
        )}
      </Section>

      {/* Forex */}
      <Section icon={DollarSign} title={t("Forex", "Forex (Kurs)")} subtitle={sevenDay}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
          : forex?.pairs?.length
            ? forex.pairs.map((q) => (
                <Row key={q.symbol} img={q.logo} symbol={q.symbol.replace("=X", "")} name={q.name} price={fmtForex(q.price)} change7d={q.change7d} spark={q.spark} />
              ))
            : unavailable}
      </Section>

      {/* Commodities */}
      <Section icon={Gem} title={t("Commodities", "Komoditas")} subtitle={sevenDay}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
          : commod?.items?.length
            ? commod.items.map((q) => (
                <Row
                  key={q.symbol}
                  iconEl={COMMODITY_ICON[q.symbol]}
                  symbol={q.symbol.replace("=F", "")}
                  name={q.name}
                  price={fmtUSD(q.price)}
                  change7d={q.change7d}
                  spark={q.spark}
                />
              ))
            : unavailable}
      </Section>

      {/* Global Indices (Asia + Europe) */}
      <Section icon={Globe} title={t("Global Indices", "Indeks Global")} subtitle={sevenDay}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : global?.asia?.length || global?.europe?.length ? (
          <>
            {global?.asia?.map((q) => (
              <Row key={q.symbol} img={q.logo} symbol={q.symbol.replace("^", "")} name={q.name} price={fmtNum(q.price)} change7d={q.change7d} spark={q.spark} />
            ))}
            {global?.europe?.map((q) => (
              <Row key={q.symbol} img={q.logo} symbol={q.symbol.replace("^", "")} name={q.name} price={fmtNum(q.price)} change7d={q.change7d} spark={q.spark} />
            ))}
          </>
        ) : (
          unavailable
        )}
      </Section>

      {/* Rates — US Treasury yields + VIX */}
      <Section icon={Landmark} title={t("US Treasury & VIX", "Obligasi AS & VIX")} subtitle={sevenDay}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
        ) : rates?.treasury?.length || rates?.vix ? (
          <>
            {rates?.treasury?.map((q) => (
              <Row key={q.symbol} img={q.logo} symbol={q.symbol.replace("^", "")} name={q.name} price={fmtPct(q.price)} change7d={q.change7d} spark={q.spark} />
            ))}
            {rates?.vix && (
              <Row img={rates.vix.logo} symbol="VIX" name={rates.vix.name} price={fmtNum(rates.vix.price)} change7d={rates.vix.change7d} spark={rates.vix.spark} />
            )}
          </>
        ) : (
          unavailable
        )}
      </Section>
      </div>
    </div>
  );
}
