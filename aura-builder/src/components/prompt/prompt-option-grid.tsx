"use client";

import { type ReactNode } from "react";

interface PromptOptionGridProps<T extends string> {
  options: { id: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
}

export function PromptOptionGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: PromptOptionGridProps<T>) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={clsx(
              "flex flex-col rounded-2xl border px-3 py-3 text-left transition",
              isActive
                ? "border-slate-900 bg-slate-900 text-white shadow"
                : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-400",
            )}
          >
            {option.icon ? (
              <span className="mb-2 text-xl">{option.icon}</span>
            ) : null}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
