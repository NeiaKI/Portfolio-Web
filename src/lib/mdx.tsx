import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

export async function compileMDX(source: string): Promise<React.ComponentType> {
  const code = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
  });

  const { default: Content } = await run(String(code), {
    ...(runtime as Parameters<typeof run>[1]),
    baseUrl: import.meta.url,
  });

  return Content as React.ComponentType;
}
