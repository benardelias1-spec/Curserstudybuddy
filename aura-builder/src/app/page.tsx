import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();

  const connectionStatus = error
    ? {
        label: "Unable to reach Supabase",
        helper:
          "Double-check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY values.",
        variant: "error" as const,
      }
    : {
        label: "Supabase client ready",
        helper: data.session
          ? "Active session detected via cookies."
          : "No session cookies yet, but the project credentials are valid.",
        variant: "success" as const,
      };

  const statusStyle =
    connectionStatus.variant === "success"
      ? "bg-emerald-600/10 text-emerald-800 border-emerald-600/30"
      : "bg-rose-600/10 text-rose-700 border-rose-600/30";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Nova Canvas starter
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            Supabase-ready Next.js workspace
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            You now have a Next.js (App Router) project wired up with Supabase server
            and browser clients, auth helpers, and a provider scaffold. Update your
            environment variables and start building the AI-first builder experience.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyle}`}
            >
              {connectionStatus.label}
            </p>
            <p className="mt-4 text-base text-slate-600">{connectionStatus.helper}</p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">1. Configure env vars</h2>
            <p className="mt-3 text-sm text-slate-600">
              Duplicate <code>.env.example</code> → <code>.env.local</code>, then paste your
              Supabase project URL and anon key. Restart <code>npm run dev</code> so Next.js
              picks up the changes.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">2. Verify auth flow</h2>
            <p className="mt-3 text-sm text-slate-600">
              Use <code>createSupabaseServerClient</code> in server components and route
              handlers, and <code>createSupabaseBrowserClient</code> anywhere in client-side
              UI. Wrap interactive trees with <code>&lt;SupabaseProvider /&gt;</code> (already wired
              in <code>layout.tsx</code>).
            </p>
          </article>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Quick links</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  className="text-indigo-600 hover:text-indigo-500"
                  href="https://supabase.com/dashboard/projects"
                  target="_blank"
                >
                  Supabase Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="text-indigo-600 hover:text-indigo-500"
                  href="https://supabase.com/docs/guides/auth/server-side/nextjs"
                  target="_blank"
                >
                  Supabase × Next.js guide
                </Link>
              </li>
              <li>
                <Link
                  className="text-indigo-600 hover:text-indigo-500"
                  href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching"
                  target="_blank"
                >
                  Next.js server data fetching
                </Link>
              </li>
            </ul>
          </article>

          <article className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50 p-6 shadow-inner">
            <h2 className="text-base font-semibold text-slate-900">Next steps</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600">
              <li>Prototype the prompt builder UI in <code>src/app/page.tsx</code>.</li>
              <li>Create API routes or server actions that call Gemini + Supabase.</li>
              <li>
                Persist generated sections in Supabase tables (templates, assets, revisions).
              </li>
            </ol>
          </article>
        </section>
      </div>
    </main>
  );
}
