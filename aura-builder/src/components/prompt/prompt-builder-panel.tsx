"use client";

import { PromptFieldset } from "@/components/prompt/prompt-fieldset";
import { PromptOptionGrid } from "@/components/prompt/prompt-option-grid";
import {
  LAYOUT_OPTIONS,
  PRESENTATION_SHELLS,
  SECTION_TYPES,
  STYLE_FAMILIES,
  TYPOGRAPHY_PRESETS,
} from "@/lib/prompt-config";
import { usePromptBuilderStore } from "@/store/prompt-builder";

export function PromptBuilderPanel() {
  const {
    sectionType,
    layout,
    presentation,
    style,
    typography,
    update,
    reset,
  } = usePromptBuilderStore();

  return (
    <aside className="flex h-full flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Prompt builder
          </p>
          <h2 className="text-lg font-semibold text-slate-900">Creative brief</h2>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          onClick={reset}
        >
          Reset
        </button>
      </div>

      <PromptFieldset title="Section" description="Tell AI what you need">
        <PromptOptionGrid
          options={SECTION_TYPES}
          value={sectionType}
          onChange={(value) => update({ sectionType: value })}
          columns={2}
        />
      </PromptFieldset>

      <PromptFieldset title="Layout" description="Pick a structure">
        <PromptOptionGrid
          options={LAYOUT_OPTIONS}
          value={layout}
          onChange={(value) => update({ layout: value })}
          columns={2}
        />
      </PromptFieldset>

      <PromptFieldset title="Presentation" description="Wrap it in a shell">
        <PromptOptionGrid
          options={PRESENTATION_SHELLS}
          value={presentation}
          onChange={(value) => update({ presentation: value })}
          columns={3}
        />
      </PromptFieldset>

      <PromptFieldset title="Style" description="Aesthetic direction">
        <PromptOptionGrid
          options={STYLE_FAMILIES}
          value={style}
          onChange={(value) => update({ style: value })}
          columns={2}
        />
      </PromptFieldset>

      <PromptFieldset title="Typography" description="Font pairing">
        <PromptOptionGrid
          options={TYPOGRAPHY_PRESETS}
          value={typography}
          onChange={(value) => update({ typography: value })}
          columns={1}
        />
      </PromptFieldset>
    </aside>
  );
}
