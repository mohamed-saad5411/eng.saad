import { createClient } from "@/lib/supabase/server";

export async function getManagedSubjectIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (profile?.role === "super_admin") {
    const { data: all } = await supabase.from("subjects").select("id");
    return (all ?? []).map((s) => s.id);
  }

  const { data: rows } = await supabase.from("admin_subjects").select("subject_id").eq("admin_id", userId);
  return (rows ?? []).map((r) => r.subject_id);
}