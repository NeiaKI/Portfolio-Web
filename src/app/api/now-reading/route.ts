import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const revalidate = 3600;

export function GET() {
  try {
    const raw = readFileSync(join(process.cwd(), "content/now-reading.json"), "utf8");
    const data = JSON.parse(raw) as {
      title: string;
      author: string;
      isbn?: string;
      progress: number;
      url?: string;
    };

    const cover = data.isbn
      ? `https://covers.openlibrary.org/b/isbn/${data.isbn}-M.jpg`
      : null;

    return NextResponse.json({ ...data, cover });
  } catch {
    return NextResponse.json(null);
  }
}
