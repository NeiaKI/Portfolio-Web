"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  alt: string;
}

export function Lightbox({ images, alt }: LightboxProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); setOpen(true); }}
            className="group relative overflow-hidden rounded-lg border border-border focus:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} screenshot ${i + 1}`}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-background/80 text-foreground px-2 py-1 rounded">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[85vh] mx-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx]}
              alt={`${alt} screenshot ${idx + 1}`}
              className="max-h-[85vh] w-auto rounded-xl border border-border shadow-2xl object-contain"
            />
            {images.length > 1 && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                {idx + 1} / {images.length}
              </p>
            )}
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
              className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
