import { createClient } from "@/lib/supabase/server";

// TODO(auth): replace this whole function body with:
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   return user?.id ?? null;
// Every dashboard page calls this ONE function — once real auth lands,
// nothing else in the dashboards needs to change.
export async function getCurrentUserId(): Promise<string | null> {
    // Temporary stub: reads a demo id from an env var so you can point it at
    // any seeded profile while testing, without touching page code.
    return process.env.DEMO_USER_ID ?? null;
}