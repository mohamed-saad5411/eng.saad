import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Component client — read-only usage is fine here (public pages
// don't need to set auth cookies). Once login exists, wrap writes through
// a client created inside a Server Action instead.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component that can't set cookies — safe to ignore
          }
        },
      },
    }
  );
}