"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/require-admin";

export async function gradeEssayAction(formData: FormData) {
  const attemptId = formData.get("attempt_id");
  const scoreValue = formData.get("essay_score");
  const score = typeof scoreValue === "string" ? Number(scoreValue) : Number.NaN;

  if (
    typeof attemptId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(attemptId) ||
    !Number.isFinite(score) ||
    score < 0
  ) {
    throw new Error("Invalid essay grade");
  }

  await requireAdmin();
  const supabase = await createClient();
  const { data: attempt, error: attemptError } = await supabase
    .from("exam_attempts")
    .select("essay_status, exams!inner(exam_questions(marks, question_type))")
    .eq("id", attemptId)
    .maybeSingle();

  if (attemptError) throw new Error(`Failed to load essay attempt: ${attemptError.message}`);
  if (!attempt || attempt.essay_status !== "pending") {
    throw new Error("Essay attempt is missing or has already been graded");
  }

  const exam = Array.isArray(attempt.exams) ? attempt.exams[0] : attempt.exams;
  const maxScore = (exam?.exam_questions ?? [])
    .filter((question) => question.question_type === "essay")
    .reduce((total, question) => total + question.marks, 0);
  if (maxScore <= 0 || score > maxScore) {
    throw new Error(`Essay score must be between 0 and ${maxScore}`);
  }

  const { data, error } = await supabase
    .from("exam_attempts")
    .update({ essay_score: score, essay_status: "graded", status: "graded" })
    .eq("id", attemptId)
    .eq("essay_status", "pending")
    .select("id")
    .maybeSingle();

  if (error) throw new Error(`Failed to save essay grade: ${error.message}`);
  if (!data) throw new Error("Essay attempt changed before the grade was saved");

  revalidatePath("/[locale]/admin/exams", "page");
}
