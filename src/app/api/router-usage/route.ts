import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

export type RouterUsage = {
  days: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  requests: number;
  updatedAt: string | null;
  configured: boolean;
};

export async function GET() {
  if (!isConfigured) {
    return NextResponse.json({
      days: 30,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cost: 0,
      requests: 0,
      updatedAt: null,
      configured: false,
    } satisfies RouterUsage);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await supabase
      .from("router_usage")
      .select("date_key, prompt_tokens, completion_tokens, cost, requests, updated_at")
      .gte("date_key", since.toISOString().slice(0, 10));

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as Array<{
      prompt_tokens: number;
      completion_tokens: number;
      cost: number;
      requests: number;
      updated_at: string;
    }>;

    const promptTokens = rows.reduce((a, r) => a + Number(r.prompt_tokens ?? 0), 0);
    const completionTokens = rows.reduce((a, r) => a + Number(r.completion_tokens ?? 0), 0);
    const cost = rows.reduce((a, r) => a + Number(r.cost ?? 0), 0);
    const requests = rows.reduce((a, r) => a + Number(r.requests ?? 0), 0);
    const latest = rows
      .map((r) => r.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1);

    return NextResponse.json({
      days: 30,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      cost,
      requests,
      updatedAt: latest ?? null,
      configured: true,
    } satisfies RouterUsage);
  } catch {
    return NextResponse.json({
      days: 30,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cost: 0,
      requests: 0,
      updatedAt: null,
      configured: false,
    } satisfies RouterUsage);
  }
}
