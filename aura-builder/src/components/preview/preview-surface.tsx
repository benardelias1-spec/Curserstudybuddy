"use client";

import { useState } from "react";
import { ScreenshotDropzone } from "@/components/preview/screenshot-dropzone";
import { usePromptBuilderStore } from "@/store/prompt-builder";

async function fileToBase64(file?: File) {
  if (!file) return null;
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PreviewSurface() {
  const {
    sectionType,
    layout,
    presentation,
    style,
    typography,
    referenceImage,
  } = usePromptBuilderStore();
  const [responseHtml, setResponseHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResponseHtml(null);
    try {
      const screenshot = await fileToBase64(referenceImage?.file);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType,
          layout,
          presentation,
          style,
          typography,
          screenshot,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unexpected error");
      }
      const data = await res.json();
      setResponseHtml(data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Preview surface
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Drop references & generate markup
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sprint 1 focuses on UX scaffolding—HTML rendering is mocked until the Gemini
          endpoint is connected.
        </p>
      </div>

      <ScreenshotDropzone />

      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="mb-2 font-semibold text-slate-700">Current prompt summary</p>
        <ul className="space-y-1">
          <li>
            <strong className="text-slate-900">Section:</strong> {sectionType}
          </li>
          <li>
            <strong className="text-slate-900">Layout:</strong> {layout}
          </li>
          <li>
            <strong className="text-slate-900">Presentation:</strong> {presentation}
          </li>
          <li>
            <strong className="text-slate-900">Style:</strong> {style}
          </li>
          <li>
            <strong className="text-slate-900">Typography:</strong> {typography}
          </li>
        </ul>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate section (mock)"}
      </button>

      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      {responseHtml ? (
        <pre className="rounded-2xl border border-slate-200 bg-slate-900/90 p-4 text-xs text-emerald-100">
          {responseHtml}
        </pre>
      ) : null}
    </section>
  );
}
