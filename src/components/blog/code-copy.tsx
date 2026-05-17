"use client";

import { useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

function CopyBtn({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copy}
      aria-label="Copy code"
      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border border-border/50 bg-muted/80 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-primary/40 hover:text-primary"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function CodeCopyInit() {
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const pres = article.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;
      pre.classList.add("group", "relative");

      const code = pre.querySelector("code")?.innerText ?? "";
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-copy-btn", "");
      wrapper.style.position = "absolute";
      wrapper.style.top = "0.75rem";
      wrapper.style.right = "0.75rem";
      pre.style.position = "relative";
      pre.appendChild(wrapper);

      // render copy button via React portal substitute
      const btn = document.createElement("button");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
      btn.className =
        "flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/40 opacity-0 transition-all hover:border-white/30 hover:text-white/80 absolute top-3 right-3";
      btn.setAttribute("aria-label", "Copy code");
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
          }, 2000);
        });
      });

      pre.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
      pre.addEventListener("mouseleave", () => { btn.style.opacity = "0"; });
      pre.appendChild(btn);
    });
  }, []);

  return null;
}
