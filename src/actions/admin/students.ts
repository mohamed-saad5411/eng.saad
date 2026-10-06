"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/require-admin";

export async function approveStudent(studentId: string) {
  await requireAdmin(); // throws/redirects if not an admin

  const supabase = await createClient();
  // verified_by / verified_at are stamped automatically by the
  // prevent_student_self_verify trigger once it sees an admin caller.
  const { error } = await supabase
    .from("students")
    .update({ verification_status: "verified", rejection_reason: null })
    .eq("id", studentId);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/admin/students", "page");
}

export async function rejectStudent(studentId: string, reason: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ verification_status: "rejected", rejection_reason: reason })
    .eq("id", studentId);

  if (error) throw new Error(error.message);
  revalidatePath("/[locale]/admin/students", "page");
}