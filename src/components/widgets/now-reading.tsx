"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

type Book = {
  title: string;
  author: string;
  cover: string | null;
  progress: number;
  url?: string;
};

export function NowReading() {
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    fetch("/api/now-reading")
      .then((r) => r.json())
      .then((d: Book | null) => { if (d?.title) setBook(d); })
      .catch(() => {});
  }, []);

  if (!book) return null;

  const BOOK = book;

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BookOpen className="h-4 w-4 text-primary" />
        Now Reading
      </div>

      <div className="flex gap-3">
        {BOOK.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={BOOK.cover}
            alt={BOOK.title}
            loading="lazy"
            decoding="async"
            className="h-16 w-11 rounded object-cover border border-border shrink-0"
          />
        ) : (
          <div className="h-16 w-11 rounded border border-border bg-muted shrink-0 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-muted-foreground/40" />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1 min-w-0">
          {BOOK.url ? (
            <a
              href={BOOK.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
            >
              {BOOK.title}
            </a>
          ) : (
            <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{BOOK.title}</p>
          )}
          <p className="text-[11px] text-muted-foreground">{BOOK.author}</p>

          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${BOOK.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{BOOK.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
