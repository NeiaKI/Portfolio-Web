"use client";

import { useEffect, useState } from "react";
import { Bitcoin, TrendingUp, TrendingDown, Flame, LineChart, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "./sparkline";

type Crypto = { id: string; symbol: string; name: string; image: string; price: number; change7d: number; spark: number[] };
type Trending = { id: string; symbol: string; name: string; thumb: string; rank: number | null };
type Quote = { symbol: string; name: string; price: number; change7d: number; currency: string; spark: number[]; logo?: string | null };

type CryptoResp = { top: Crypto[]; trending: Trending[] };
type UsResp = { indices: Quote[]; stocks: Quote[] };
type IdResp = { index: Quote | null; stocks: Quote[] };

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
  symbol,
  name,
  price,
  change7d,
  spark,
  showChange = true,
}: {
  rank?: number;
  img?: string | null;
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
      {img ? (
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

export function MarketDashboard({ locale }: { locale: string }) {
  const [crypto, setCrypto] = useState<CryptoResp | null>(null);
  const [us, setUs] = useState<UsResp | null>(null);
  const [id, setId] = useState<IdResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/market/crypto").then((r) => r.json()).catch(() => null),
      fetch("/api/market/us").then((r) => r.json()).catch(() => null),
      fetch("/api/market/id").then((r) => r.json()).catch(() => null),
    ]).then(([c, u, i]) => {
      setCrypto(c);
      setUs(u);
      setId(i);
      setLoading(false);
    });
  }, []);

  const t = (en: string, idText: string) => (locale === "id" ? idText : en);
  const sevenDay = t("7-day change", "perubahan 7 hari");
  const unavailable = <p className="px-4 py-6 text-center text-xs text-muted-foreground">{t("Unavailable", "Tidak tersedia")}</p>;

  return (
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
              <Row key={q.symbol} symbol={q.symbol.replace("^", "")} name={q.name} price={fmtNum(q.price)} change7d={q.change7d} spark={q.spark} />
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
        ) : (
          <>
            {id?.index && (
              <Row symbol="IHSG" name={t("Jakarta Composite (IHSG)", "Indeks Harga Saham Gabungan")} price={fmtNum(id.index.price)} change7d={id.index.change7d} spark={id.index.spark} />
            )}
            {id?.stocks?.length
              ? id.stocks.map((q, i) => (
                  <Row key={q.symbol} rank={i + 1} img={q.logo} symbol={q.symbol.replace(".JK", "")} name={q.name} price={fmtIDR(q.price)} change7d={q.change7d} spark={q.spark} />
                ))
              : !id?.index && unavailable}
          </>
        )}
      </Section>
    </div>
  );
}
