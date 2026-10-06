import { createClient } from "@supabase/supabase-js";

// NEVER import this in a Client Component or anywhere that ships to the
// browser — SUPABASE_SERVICE_ROLE_KEY bypasses RLS entirely. Server Actions
// and Route Handlers only.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}