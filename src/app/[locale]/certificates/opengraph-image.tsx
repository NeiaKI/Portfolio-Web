import { OG_SIZE, makeOgImage } from "@/lib/og-image";
export const runtime = "edge";
export const contentType = "image/png";
export const size = OG_SIZE;
export default function Image() {
  return makeOgImage("Certificates", "AWS · Google · Udemy · Dicoding & more", "#f9e2af");
}
