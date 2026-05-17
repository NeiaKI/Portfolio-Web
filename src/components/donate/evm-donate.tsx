"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  address: string;
  title: string;
  desc: string;
  copyLabel: string;
  copiedLabel: string;
  note: string;
}

export function EvmDonate({ address, title, desc, copyLabel, copiedLabel, note }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-purple-500/30">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#627EEA]/15 p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/ethereum.svg"
            alt="Ethereum"
            className="h-full w-full object-contain"
            style={{ filter: "invert(41%) sepia(71%) saturate(516%) hue-rotate(199deg) brightness(96%) contrast(96%)" }}
          />
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">ETH · MATIC · BNB · EVM</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>

      {address ? (
        <div className="flex flex-col gap-2">
          {/* Address display */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-3">
            <code className="flex-1 truncate font-mono text-xs text-foreground">
              {address}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-purple-500/40 hover:text-foreground shrink-0"
            >
              {copied ? (
                <><Check className="h-3 w-3 text-green-500" />{copiedLabel}</>
              ) : (
                <><Copy className="h-3 w-3" />{copyLabel}</>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">{note}</p>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border px-4 py-2.5 text-center text-xs text-muted-foreground font-mono">
          NEXT_PUBLIC_ETH_ADDRESS=0x...
        </p>
      )}
    </div>
  );
}
