"use client";

import { useEffect } from "react";

export function CodeCopyInit() {
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const pres = article.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;

      pre.style.position = "relative";

      // Detect language from code element class
      const codeEl = pre.querySelector("code");
      const langClass = Array.from(codeEl?.classList ?? []).find((c) =>
        c.startsWith("language-")
      );
      const lang = langClass?.replace("language-", "");

      // Language label
      if (lang && lang !== "text" && lang !== "plain") {
        const label = document.createElement("span");
        label.textContent = lang;
        label.style.cssText = `
          position: absolute;
          top: 0.65rem;
          left: 1rem;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          font-family: var(--font-jetbrains-mono, monospace);
          line-height: 1;
        `;
        pre.appendChild(label);

        // Indent code content so it doesn't overlap label
        if (codeEl) {
          codeEl.style.paddingTop = "2rem";
          codeEl.style.display = "block";
        }
      }

      // Copy button
      const btn = document.createElement("button");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
      btn.className =
        "flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-white/40 opacity-0 transition-all hover:border-white/30 hover:text-white/70 absolute top-2.5 right-2.5";
      btn.setAttribute("aria-label", "Copy code");
      btn.setAttribute("data-copy-btn", "");

      const code = codeEl?.innerText ?? "";
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          btn.style.color = "rgba(166,227,161,0.8)";
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
            btn.style.color = "";
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
