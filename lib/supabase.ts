import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

// Cliente para o Navegador (Client-side)
export function getSupabaseClient() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseBrowserClient;
}

// Cliente Admin para a API Server-side (usa Service Role Key para ignorar RLS ou Anon Key)
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}