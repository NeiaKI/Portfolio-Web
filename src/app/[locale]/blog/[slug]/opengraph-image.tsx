import { makeOgImage } from "@/lib/og-image";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogPostOgImage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Blog";
  const subtitle = post?.description ?? "nateeki.dev";
  return makeOgImage(title, subtitle, "#cba6f7");
}
