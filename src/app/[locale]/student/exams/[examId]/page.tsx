import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { submitExamAction } from "@/actions/learning";

const copy = {
  ar: {
    submit: "تسليم الامتحان",
    alreadySubmitted: "سلّمت الامتحان ده قبل كده",
    yourScore: "درجتك",
    pendingEssay: "جزء المقالي لسه تحت التصحيح",
  },
  en: {
    submit: "Submit exam",
    alreadySubmitted: "You already submitted this exam",
    yourScore: "Your score",
    pendingEssay: "The essay part is still being graded",
  },
};

export default async function ExamPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; examId: string }>;
}) {
  const { locale, examId } = await params;
  const t = copy[locale];

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select(
      `
      id, has_essay, passing_score,
      exam_questions ( id, question_text, question_type, marks, sort_order, question_choices ( id, choice_text ) )
    `
    )
    .eq("id", examId)
    .single();

  if (!exam) notFound();

  const { data: existingAttempt } = await supabase
    .from("exam_attempts")
    .select("status, mcq_score, essay_status, essay_score")
    .eq("exam_id", examId)
    .eq("student_id", userId)
    .maybeSingle();

  const questions = (exam.exam_questions ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);

  if (existingAttempt) {
    const total = (existingAttempt.mcq_score ?? 0) + (existingAttempt.essay_score ?? 0);
    return (
      <section className="container-page max-w-xl py-16 text-center">
        <p className="text-lg font-bold">{t.alreadySubmitted}</p>
        {existingAttempt.status === "graded" ? (
          <p className="mt-2 text-2xl font-bold text-[var(--color-brand)]">{t.yourScore}: {total}</p>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-muted)]">{t.pendingEssay}</p>
        )}
      </section>
    );
  }

  return (
    <section className="container-page max-w-xl py-16">
      <form action={submitExamAction} className="flex flex-col gap-8">
        <input type="hidden" name="exam_id" value={exam.id} />
        <input type="hidden" name="has_essay" value={String(exam.has_essay)} />

        {questions.map((q: any, i: number) => (
          <div key={q.id}>
            <input type="hidden" name="question_id" value={q.id} />
            <p className="font-semibold">{i + 1}. {q.question_text}</p>

            {q.question_type === "essay" ? (
              <textarea
                name={`answer_${q.id}`}
                rows={4}
                className="mt-3 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm"
              />
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {(q.question_choices ?? []).map((c: any) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={`answer_${q.id}`} value={c.id} required />
                    {c.choice_text}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button className="rounded-xl bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)]">
          {t.submit}
        </button>
      </form>
    </section>
  );
}