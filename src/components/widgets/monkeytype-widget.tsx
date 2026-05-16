"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Keyboard, Target, Zap, Clock, TrendingUp, Award } from "lucide-react";

interface PBMode { mode: string; wpm: number; acc: number; consistency: number }

interface MonkeyData {
  bestWpm: number;
  bestRaw: number;
  bestAcc: number;
  bestConsistency: number;
  avgWpm: number;
  completedTests: number;
  startedTests: number;
  timeTyping: string;
  streak: number;
  pbByMode: PBMode[];
}

function StatCard({
  icon: Icon,
  value,
  label,
  sub,
  color,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 p-3 flex gap-3 items-start">
      <div className={`mt-0.5 rounded-md p-1.5 bg-muted ${color ?? "text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none ${color ?? "text-foreground"}`}>{value}</p>
        <p className="text-[11px] text-foreground mt-1">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function MonkeyTypeWidget() {
  const [data, setData] = useState<MonkeyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monkeytype")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-primary" />
          <h2 className="text-xl font-bold text-foreground">MonkeyType Performance</h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
          <TrendingUp className="h-3 w-3" /> Personal Bests
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : data ? (
          <>
            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon={Zap} value={data.bestWpm} label="Best WPM" sub={`Avg: ${data.avgWpm} WPM`} color="text-yellow-500" />
              <StatCard icon={Target} value={`${data.bestAcc}%`} label="Best Accuracy" sub={`Consistency: ${data.bestConsistency}%`} color="text-green-500" />
              <StatCard icon={Keyboard} value={data.completedTests.toLocaleString()} label="Tests Completed" sub={`${data.startedTests.toLocaleString()} started`} color="text-primary" />
              <StatCard icon={Clock} value={data.timeTyping} label="Time Typing" color="text-orange-400" />
              <StatCard icon={Zap} value={data.bestRaw} label="Best Raw WPM" sub="Uncorrected speed" color="text-yellow-400" />
              <StatCard icon={Award} value={`${data.bestConsistency}%`} label="Best Consistency" sub="Typing stability" color="text-violet-400" />
            </div>

            {/* Charts */}
            {data.pbByMode.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WPM by mode line chart */}
                <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[11px] font-semibold text-foreground">WPM by Mode</p>
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={data.pbByMode}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mode" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Accuracy & Consistency bar chart */}
                <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[11px] font-semibold text-foreground">Accuracy & Consistency</p>
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={data.pbByMode}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mode" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="acc" name="Accuracy" fill="hsl(var(--foreground))" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="consistency" name="Consistency" fill="hsl(var(--muted-foreground))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">MonkeyType data unavailable.</p>
        )}
      </div>
    </section>
  );
}
