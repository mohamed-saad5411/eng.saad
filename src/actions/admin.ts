"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";

export async function verifyStudentAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const studentId = formData.get("student_id") as string;
  const supabase = await createClient();

  await supabase
    .from("students")
    .update({ verification_status: "verified", verified_by: userId, verified_at: new Date().toISOString() })
    .eq("id", studentId);

  revalidatePath("/admin/students");
}

export async function rejectStudentAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const studentId = formData.get("student_id") as string;
  const reason = formData.get("rejection_reason") as string;
  const supabase = await createClient();

  await supabase
    .from("students")
    .update({
      verification_status: "rejected",
      verified_by: userId,
      verified_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq("id", studentId);

  revalidatePath("/admin/students");
}

export async function toggleProgramPublishAction(formData: FormData) {
  const programId = formData.get("program_id") as string;
  const nextValue = formData.get("next_value") === "true";
  const supabase = await createClient();

  await supabase.from("programs").update({ is_published: nextValue }).eq("id", programId);

  revalidatePath("/admin/content");
}

export async function gradeEssayAction(formData: FormData) {
  const attemptId = formData.get("attempt_id") as string;
  const essayScore = Number(formData.get("essay_score"));
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: attempt } = await supabase
    .from("exam_attempts")
    .select("mcq_score")
    .eq("id", attemptId)
    .single();

  await supabase
    .from("exam_attempts")
    .update({
      essay_score: essayScore,
      essay_status: "graded",
      status: "graded",
      graded_by: userId,
      graded_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  revalidatePath("/admin/exams");
}