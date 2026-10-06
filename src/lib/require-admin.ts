import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";

export type AdminContext = {
  userId: string;
  role: "super_admin" | "subject_admin";
  isSuperAdmin: boolean;
  managedSubjectIds: string[]; // empty + isSuperAdmin=true means "sees everything"
};

/**
 * Call this at the top of every admin page. Redirects to /login if not
 * authenticated, and to / if authenticated but not an admin. Returns the
 * admin's managed subject ids so pages can scope their own queries exactly
 * the way RLS already scopes writes — avoids an admin seeing an empty page
 * with no explanation when they're a subject_admin outside their subjects.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || (profile.role !== "super_admin" && profile.role !== "subject_admin")) {
    redirect("/");
  }

  let managedSubjectIds: string[] = [];
  if (profile.role === "subject_admin") {
    const { data: rows } = await supabase
      .from("admin_subjects")
      .select("subject_id")
      .eq("admin_id", userId);
    managedSubjectIds = (rows ?? []).map((r) => r.subject_id);
  }

  return {
    userId,
    role: profile.role,
    isSuperAdmin: profile.role === "super_admin",
    managedSubjectIds,
  };
}