"use client";

import { useState } from "react";
import { ExternalLink, Coffee } from "lucide-react";

interface Props {
  name: string;
  logo: string;
  placeholder: string;
  desc: string;
  url: string | null;
  donateLabel: string;
  envKey: string;
  color: string;
  btnColor: string;
}

export function PlatformCard({ name, logo, placeholder, desc, url, donateLabel, envKey, color, btnColor }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={`flex flex-col gap-4 rounded-2xl border p-6 transition-colors ${color}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-2">
          {imgFailed ? (
            <Coffee className="h-6 w-6 text-muted-foreground" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={name}
              className="h-full w-full object-contain"
              onError={() => setImgFailed(true)}
            />
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{placeholder}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${btnColor}`}
        >
          {donateLabel} via {name}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <p className="rounded-xl border border-dashed border-border px-4 py-2.5 text-center text-xs text-muted-foreground font-mono">
          {envKey}=your_username
        </p>
      )}
    </div>
  );
}
