import { NextResponse } from "next/server";
import { getGithubProjectsCached } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await getGithubProjectsCached();
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
