# Sprint 1 – Prompt Builder & Screenshot Ingestion

## Goals
- Deliver an interactive prompt builder side panel with structured selectors (section, layout, presentation, style, typography).
- Allow users to drop/upload hero reference screenshots which we will send to Gemini in a later iteration.
- Wire up global state so the builder view and future API calls share the same data contract.
- Stub a `/api/generate` route that validates payloads and (temporarily) returns mock HTML until Gemini access is ready.

## UI Architecture
- **Layout**: Split screen (sidebar width ~360px on the left, preview canvas on the right). Sidebar contains stacked accordions for prompt categories. Canvas shows dropzone + version list placeholder.
- **Components**:
  - `PromptBuilderPanel` (client component)
  - `PromptFieldset` (collapsible sections)
  - `ScreenshotDropzone`
  - `PreviewSurface` (renders iframe placeholder + version list)
- **State**: Zustand store (`src/store/prompt-builder.ts`) with shape:
  ```ts
  type PromptBuilderState = {
    sectionType: SectionType;
    layout: LayoutOption;
    presentation: PresentationShell;
    style: StyleTokens;
    typography: TypographyPair;
    referenceImage?: {
      id: string;
      name: string;
      previewUrl: string;
      file?: File;
    };
    update(values: Partial<PromptBuilderState>): void;
    reset(): void;
  }
  ```

## Data Flow
1. User selects prompt options → state updates instantly.
2. User drops screenshot → we store preview URL in state & hold the `File` for upload.
3. “Generate” button sends `POST /api/generate` with selections + base64 screenshot (we’ll add streaming later).
4. API route currently returns `{ html: "<section>Coming soon</section>" }` so preview can render something.

## Technical Needs
- Add Zustand dependency (`npm install zustand`).
- Create helper enums/constants for builder options under `src/lib/prompt-config.ts`.
- Build accessible form controls (radios, select cards, chips) with Tailwind.
- Implement dropzone using native drag events (keep it simple, no external dep yet).
- API route lives at `src/app/api/generate/route.ts` using Next.js App Router handlers.

## Acceptance Criteria
- Sidebar controls are keyboard accessible and reflect current selections.
- Screenshot dropzone accepts drag/drop + click-to-upload, shows file name + thumbnail.
- “Generate” button logs payload + shows temporary HTML output on the preview surface.
- API stub validates request body and returns mock HTML + timestamp to confirm round trip.
