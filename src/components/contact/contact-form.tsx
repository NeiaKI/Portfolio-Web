"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface Labels {
  title: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  successDesc: string;
  error: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
}

export function ContactForm({ labels: l }: { labels: Labels }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-card p-6">
      <h2 className="font-semibold text-foreground">{l.title}</h2>

      {status === "success" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{l.success}</p>
            <p className="mt-1 text-sm text-muted-foreground">{l.successDesc}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">{l.name}</label>
            <input
              type="text"
              required
              className={inputCls}
              placeholder={l.namePlaceholder}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">{l.email}</label>
            <input
              type="email"
              required
              className={inputCls}
              placeholder={l.emailPlaceholder}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">{l.message}</label>
            <textarea
              required
              rows={5}
              className={`${inputCls} resize-none`}
              placeholder={l.messagePlaceholder}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </div>
          {status === "error" && (
            <p className="text-xs text-destructive">{l.error}</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {status === "sending" ? l.sending : l.send}
          </button>
        </form>
      )}
    </div>
  );
}
