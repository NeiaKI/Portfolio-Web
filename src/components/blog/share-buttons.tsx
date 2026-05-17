"use client";

import { useState } from "react";
import { Link, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=nateeki`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Share:</span>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X / Twitter
      </a>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        {copied ? <Check className="h-3 w-3" /> : <Link className="h-3 w-3" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
