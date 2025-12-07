import { PromptBuilderPanel } from "@/components/prompt/prompt-builder-panel";
import { PreviewSurface } from "@/components/preview/preview-surface";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <PromptBuilderPanel />
        <PreviewSurface />
      </div>
    </main>
  );
}
