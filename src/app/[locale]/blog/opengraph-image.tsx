import { OG_SIZE, makeOgImage } from "@/lib/og-image";
export const runtime = "edge";
export const contentType = "image/png";
export const size = OG_SIZE;
export default function Image() {
  return makeOgImage("Blog", "Thoughts on code, tools & creativity", "#a6e3a1");
}
