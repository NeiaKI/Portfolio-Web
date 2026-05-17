import { OG_SIZE, makeOgImage } from "@/lib/og-image";
export const runtime = "edge";
export const contentType = "image/png";
export const size = OG_SIZE;
export default function Image() {
  return makeOgImage("Contact", "Get in touch — let's build something together", "#cba6f7");
}
