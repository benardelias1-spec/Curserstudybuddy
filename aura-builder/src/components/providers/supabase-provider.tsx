"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { type ReactNode, useState } from "react";
import { type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabaseClient] = useState<SupabaseClient>(() =>
    createSupabaseBrowserClient(),
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
