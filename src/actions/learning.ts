"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";

export async function markVideoWatchedAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const videoId = formData.get("video_id") as string;
  const lessonPath = formData.get("lesson_path") as string; // for revalidation

  const supabase = await createClient();

  await supabase
    .from("video_views")
    .upsert(
      {
        student_id: userId,
        video_id: videoId,
        watch_percentage: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "student_id,video_id" }
    );

  revalidatePath(lessonPath);
}

export async function submitExamAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const examId = formData.get("exam_id") as string;
  const hasEssay = formData.get("has_essay") === "true";
  const questionIds = formData.getAll("question_id") as string[];

  const supabase = await createClient();

  // fetch the correct choice for every mcq/true_false question, for auto-grading
  const { data: questions } = await supabase
    .from("exam_questions")
    .select("id, question_type, marks, question_choices ( id, is_correct )")
    .in("id", questionIds);

  const { data: attempt } = await supabase
    .from("exam_attempts")
    .upsert(
      {
        exam_id: examId,
        student_id: userId,
        status: "submitted",
        essay_status: hasEssay ? "pending" : "not_applicable",
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "exam_id,student_id" }
    )
    .select("id")
    .single();

  if (!attempt) redirect("/student/exams?error=1");

  let mcqScore = 0;

  for (const q of questions ?? []) {
    if (q.question_type === "essay") {
      const text = formData.get(`answer_${q.id}`) as string;
      await supabase.from("attempt_answers").upsert(
        { attempt_id: attempt.id, question_id: q.id, answer_text: text },
        { onConflict: "attempt_id,question_id" }
      );
      continue;
    }

    const selectedChoiceId = formData.get(`answer_${q.id}`) as string;
    const correctChoice = (q.question_choices ?? []).find((c: any) => c.is_correct);
    const isCorrect = selectedChoiceId === correctChoice?.id;
    const marksAwarded = isCorrect ? q.marks : 0;
    mcqScore += marksAwarded;

    await supabase.from("attempt_answers").upsert(
      {
        attempt_id: attempt.id,
        question_id: q.id,
        selected_choice_id: selectedChoiceId || null,
        is_correct: isCorrect,
        marks_awarded: marksAwarded,
      },
      { onConflict: "attempt_id,question_id" }
    );
  }

  await supabase
    .from("exam_attempts")
    .update({ mcq_score: mcqScore, status: hasEssay ? "submitted" : "graded" })
    .eq("id", attempt.id);

  redirect("/student/exams?submitted=1");
}