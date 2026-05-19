import { OG_SIZE, makeOgImage } from "@/lib/og-image";
import { getProjectBySlug } from "@/lib/data";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = OG_SIZE;

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return makeOgImage("Project", "nateeki.dev");

  const subtitle = project.tech_stack?.length
    ? project.tech_stack.slice(0, 4).join(" · ")
    : project.description;

  return makeOgImage(project.title, subtitle, "#a6e3a1");
}
