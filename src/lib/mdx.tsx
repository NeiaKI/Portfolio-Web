import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

export async function compileMDX(source: string): Promise<React.ComponentType> {
  const code = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeHighlight],
  });

  const { default: Content } = await run(String(code), {
    ...(runtime as Parameters<typeof run>[1]),
    baseUrl: import.meta.url,
  });

  return Content as React.ComponentType;
}
