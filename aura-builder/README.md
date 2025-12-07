# Nova Canvas – Supabase ready Next.js starter

This repository bootstraps the “better-than-Aura” builder initiative with a fully typed Next.js (App Router) stack, Tailwind CSS, and Supabase wired up on both the server and client. Use it as the foundation for the AI-first landing page builder and marketplace we scoped together.

## Stack
- **Next.js 14 (App Router)** with TypeScript + Tailwind CSS
- **Supabase** via `@supabase/auth-helpers-*` for server/browser clients
- **SessionContextProvider** already mounted in `src/app/layout.tsx`
- Absolute imports through the `@/*` alias

## Getting started
1. Install dependencies (already run on scaffold, but in case):
   ```bash
   npm install
   ```
2. Copy the environment template and fill in your Supabase project values:
   ```bash
   cp .env.example .env.local
   # add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) – the home page pings Supabase on the server and surfaces connection status + next steps.

## Supabase helpers
- `src/lib/supabase/browser.ts` → `createSupabaseBrowserClient()` for client components/hooks.
- `src/lib/supabase/server.ts` → `createSupabaseServerClient()` for server components, route handlers, and server actions.
- `src/components/providers/supabase-provider.tsx` wraps the app in `SessionContextProvider` so any child can use `useSession`, `useSupabaseClient`, etc.

## Suggested next steps
- Build the prompt-builder UI directly in `src/app/page.tsx` or split it into feature modules inside `src/app/(dashboard)/` routes.
- Add Supabase tables for `templates`, `assets`, `revisions`, and `marketplaces` plus RLS policies.
- Implement API routes or server actions that invoke Gemini/GPT and persist results to Supabase.
- Flesh out the presentation canvas + marketplace milestones from our backlog.

## Deployment
Deploy to Vercel or any platform with Node 18+. Remember to set the same Supabase env vars in the hosting environment.
