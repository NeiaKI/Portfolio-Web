import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export function GET() {
  const posts = getAllPosts();
  return NextResponse.json(posts);
}
