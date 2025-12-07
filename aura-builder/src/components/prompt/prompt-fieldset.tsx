"use client";

import { type ReactNode } from "react";

interface PromptFieldsetProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PromptFieldset({ title, description, children }: PromptFieldsetProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <header>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        ) : null}
      </header>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
