// import { redirect, notFound } from "next/navigation";
// import Link from "next/link";
// import { CheckCircle2, Circle, Lock } from "lucide-react";
// import { createClient } from "@/lib/supabase/server";
// import { getCurrentUserId } from "@/lib/auth/current-user";
// import { markVideoWatchedAction } from "@/actions/learning";

// const copy = {
//   ar: {
//     explanation: "فيديو الشرح",
//     pastExam: "حل امتحانات سابقة",
//     markWatched: "علّمه كمشاهد",
//     watched: "تمت المشاهدة",
//     notReady: "الفيديو لسه مش جاهز",
//     examUnlocked: "امتحان الدرس اتفتح",
//     goToExam: "ابدأ الامتحان",
//     examLocked: "شاهد الفيديوهين الأول عشان يتفتح امتحان الدرس",
//     unitExamUnlocked: "امتحان الوحدة اتفتح",
//     goToUnitExam: "ابدأ امتحان الوحدة",
//     unitExamLocked: "اجتياز امتحانات كل دروس الوحدة بنجاح يفتح امتحان الوحدة",
//   },
//   en: {
//     explanation: "Explanation video",
//     pastExam: "Past-exam problem solving",
//     markWatched: "Mark as watched",
//     watched: "Watched",
//     notReady: "Video not ready yet",
//     examUnlocked: "Lesson exam unlocked",
//     goToExam: "Start the exam",
//     examLocked: "Watch both videos to unlock the lesson exam",
//     unitExamUnlocked: "Unit exam unlocked",
//     goToUnitExam: "Start the unit exam",
//     unitExamLocked: "Pass every lesson exam in this unit to unlock the unit exam",
//   },
// };

// export default async function LessonPage({
//   params,
// }: {
//   params: Promise<{
//     locale: "ar" | "en";
//     programId: string;
//     termId: string;
//     unitId: string;
//     lessonId: string;
//   }>;
// }) {
//   const { locale, programId, termId, unitId, lessonId } = await params;
//   const t = copy[locale];

//   const userId = await getCurrentUserId();
//   if (!userId) redirect("/login");

//   const supabase = await createClient();

//   const { data: lesson } = await supabase
//     .from("lessons")
//     .select("id, title")
//     .eq("id", lessonId)
//     .single();

//   if (!lesson) notFound();

//   const { data: videos } = await supabase
//     .from("videos")
//     .select("id, kind, status, asset_id")
//     .eq("lesson_id", lessonId);

//   const { data: views } = await supabase
//     .from("video_views")
//     .select("video_id, completed_at")
//     .eq("student_id", userId)
//     .in("video_id", (videos ?? []).map((v) => v.id));

//   const completedVideoIds = new Set(
//     (views ?? []).filter((v) => v.completed_at).map((v) => v.video_id)
//   );

//   const allWatched = (videos ?? []).length > 0 && (videos ?? []).every((v) => completedVideoIds.has(v.id));

//   const { data: lessonExam } = await supabase
//     .from("exams")
//     .select("id")
//     .eq("lesson_id", lessonId)
//     .eq("scope", "lesson")
//     .eq("is_published", true)
//     .maybeSingle();

//   // --- unit exam unlock check: every lesson in this unit must have a
//   // passed (graded, mcq_score >= passing_score) lesson exam attempt ---
//   const { data: unitLessons } = await supabase
//     .from("lessons")
//     .select("id")
//     .eq("unit_id", unitId);

//   const { data: unitLessonExams } = await supabase
//     .from("exams")
//     .select("id, lesson_id, passing_score")
//     .eq("scope", "lesson")
//     .eq("is_published", true)
//     .in("lesson_id", (unitLessons ?? []).map((l) => l.id));

//   const { data: unitAttempts } = await supabase
//     .from("exam_attempts")
//     .select("exam_id, mcq_score, status")
//     .eq("student_id", userId)
//     .in("exam_id", (unitLessonExams ?? []).map((e) => e.id));

//   const attemptByExamId = new Map((unitAttempts ?? []).map((a) => [a.exam_id, a]));

//   // every lesson in the unit must have a published lesson exam that was
//   // passed — if a lesson has no exam yet, it doesn't block the unit exam
//   const allLessonExamsPassed =
//     (unitLessonExams ?? []).length > 0 &&
//     (unitLessonExams ?? []).every((exam) => {
//       const attempt = attemptByExamId.get(exam.id);
//       return attempt && attempt.status !== "in_progress" && (attempt.mcq_score ?? 0) >= exam.passing_score;
//     });

//   const { data: unitExam } = allLessonExamsPassed
//     ? await supabase
//         .from("exams")
//         .select("id")
//         .eq("unit_id", unitId)
//         .eq("scope", "unit")
//         .eq("is_published", true)
//         .maybeSingle()
//     : { data: null };

//   const lessonPath = `/student/programs/${programId}/terms/${termId}/units/${unitId}/lessons/${lessonId}`;

//   const kindLabel = (kind: string) => (kind === "explanation" ? t.explanation : t.pastExam);

//   return (
//     <section className="container-page max-w-2xl py-16">
//       <h1 className="text-2xl font-bold">{lesson.title}</h1>

//       <div className="mt-8 flex flex-col gap-6">
//         {(videos ?? []).map((video) => {
//           const watched = completedVideoIds.has(video.id);
//           return (
//             <div key={video.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-semibold">{kindLabel(video.kind)}</span>
//                 {watched ? (
//                   <span className="flex items-center gap-1 text-sm text-[var(--color-brand)]">
//                     <CheckCircle2 size={16} /> {t.watched}
//                   </span>
//                 ) : (
//                   <Circle size={16} className="text-[var(--color-muted)]" />
//                 )}
//               </div>

//               {video.status === "ready" ? (
//                 <video controls className="mt-4 w-full rounded-xl" src={video.asset_id ?? undefined} />
//               ) : (
//                 <p className="mt-4 text-sm text-[var(--color-muted)]">{t.notReady}</p>
//               )}

//               {!watched && (
//                 <form action={markVideoWatchedAction} className="mt-4">
//                   <input type="hidden" name="video_id" value={video.id} />
//                   <input type="hidden" name="lesson_path" value={lessonPath} />
//                   <button className="rounded-xl bg-[var(--color-ink)] px-5 py-2 text-sm font-semibold text-[var(--color-bg)]">
//                     {t.markWatched}
//                   </button>
//                 </form>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
//         {allWatched && lessonExam ? (
//           <Link
//             href={`/student/exams/${lessonExam.id}`}
//             className="flex items-center justify-between text-sm font-semibold text-[var(--color-brand)]"
//           >
//             {t.examUnlocked}
//             <span>{t.goToExam} ←</span>
//           </Link>
//         ) : (
//           <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
//             <Lock size={16} /> {t.examLocked}
//           </div>
//         )}
//       </div>

//       <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
//         {unitExam ? (
//           <Link
//             href={`/student/exams/${unitExam.id}`}
//             className="flex items-center justify-between text-sm font-semibold text-[var(--color-amber)]"
//           >
//             {t.unitExamUnlocked}
//             <span>{t.goToUnitExam} ←</span>
//           </Link>
//         ) : (
//           <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
//             <Lock size={16} /> {t.unitExamLocked}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { markVideoWatchedAction } from "@/actions/learning";

const copy = {
  ar: {
    explanation: "فيديو الشرح",
    pastExam: "حل امتحانات سابقة",
    markWatched: "علّمه كمشاهد",
    watched: "تمت المشاهدة",
    notReady: "الفيديو لسه مش جاهز",
    examUnlocked: "امتحان الدرس اتفتح",
    goToExam: "ابدأ الامتحان",
    examLocked: "شاهد الفيديوهين الأول عشان يتفتح امتحان الدرس",
    unitExamUnlocked: "امتحان الوحدة اتفتح",
    goToUnitExam: "ابدأ امتحان الوحدة",
    unitExamLocked: "اجتياز امتحانات كل دروس الوحدة بنجاح يفتح امتحان الوحدة",
  },
  en: {
    explanation: "Explanation video",
    pastExam: "Past-exam problem solving",
    markWatched: "Mark as watched",
    watched: "Watched",
    notReady: "Video not ready yet",
    examUnlocked: "Lesson exam unlocked",
    goToExam: "Start the exam",
    examLocked: "Watch both videos to unlock the lesson exam",
    unitExamUnlocked: "Unit exam unlocked",
    goToUnitExam: "Start the unit exam",
    unitExamLocked: "Pass every lesson exam in this unit to unlock the unit exam",
  },
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{
    locale: "ar" | "en";
    programId: string;
    termId: string;
    unitId: string;
    lessonId: string;
  }>;
}) {
  const { locale, programId, termId, unitId, lessonId } = await params;
  const t = copy[locale];

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const { data: videos } = await supabase
    .from("videos")
    .select("id, kind, status, asset_id")
    .eq("lesson_id", lessonId);

  const { data: views } = await supabase
    .from("video_views")
    .select("video_id, completed_at")
    .eq("student_id", userId)
    .in("video_id", (videos ?? []).map((v) => v.id));

  const completedVideoIds = new Set(
    (views ?? []).filter((v) => v.completed_at).map((v) => v.video_id)
  );

  const allWatched = (videos ?? []).length > 0 && (videos ?? []).every((v) => completedVideoIds.has(v.id));

  const { data: lessonExam } = await supabase
    .from("exams")
    .select("id")
    .eq("lesson_id", lessonId)
    .eq("scope", "lesson")
    .eq("is_published", true)
    .maybeSingle();

  // --- unit exam unlock check: every lesson in this unit must have a
  // passed (graded, mcq_score >= passing_score) lesson exam attempt ---
  const { data: unitLessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("unit_id", unitId);

  const { data: unitLessonExams } = await supabase
    .from("exams")
    .select("id, lesson_id, passing_score")
    .eq("scope", "lesson")
    .eq("is_published", true)
    .in("lesson_id", (unitLessons ?? []).map((l) => l.id));

  const { data: unitAttempts } = await supabase
    .from("exam_attempts")
    .select("exam_id, mcq_score, status")
    .eq("student_id", userId)
    .in("exam_id", (unitLessonExams ?? []).map((e) => e.id));

  const attemptByExamId = new Map((unitAttempts ?? []).map((a) => [a.exam_id, a]));

  // every lesson in the unit must have a published lesson exam that was
  // passed — if a lesson has no exam yet, it doesn't block the unit exam
  const allLessonExamsPassed =
    (unitLessonExams ?? []).length > 0 &&
    (unitLessonExams ?? []).every((exam) => {
      const attempt = attemptByExamId.get(exam.id);
      return attempt && attempt.status !== "in_progress" && (attempt.mcq_score ?? 0) >= exam.passing_score;
    });

  const { data: unitExam } = allLessonExamsPassed
    ? await supabase
      .from("exams")
      .select("id")
      .eq("unit_id", unitId)
      .eq("scope", "unit")
      .eq("is_published", true)
      .maybeSingle()
    : { data: null };

  const lessonPath = `/student/programs/${programId}/terms/${termId}/units/${unitId}/lessons/${lessonId}`;

  const kindLabel = (kind: string) => (kind === "explanation" ? t.explanation : t.pastExam);

  return (
    <section className="container-page max-w-2xl py-16">
      <h1 className="text-2xl font-bold">{lesson.title}</h1>

      <div className="mt-8 flex flex-col gap-6">
        {(videos ?? []).map((video) => {
          const watched = completedVideoIds.has(video.id);
          return (
            <div key={video.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{kindLabel(video.kind)}</span>
                {watched ? (
                  <span className="flex items-center gap-1 text-sm text-[var(--color-brand)]">
                    <CheckCircle2 size={16} /> {t.watched}
                  </span>
                ) : (
                  <Circle size={16} className="text-[var(--color-muted)]" />
                )}
              </div>

              {video.status === "ready" ? (
                <video controls className="mt-4 w-full rounded-xl" src={video.asset_id ?? undefined} />
              ) : (
                <p className="mt-4 text-sm text-[var(--color-muted)]">{t.notReady}</p>
              )}

              {!watched && (
                <form action={markVideoWatchedAction} className="mt-4">
                  <input type="hidden" name="video_id" value={video.id} />
                  <input type="hidden" name="lesson_path" value={lessonPath} />
                  <button className="rounded-xl bg-[var(--color-ink)] px-5 py-2 text-sm font-semibold text-[var(--color-bg)]">
                    {t.markWatched}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        {allWatched && lessonExam ? (
          <Link
            href={`/student/exams/${lessonExam.id}`}
            className="flex items-center justify-between text-sm font-semibold text-[var(--color-brand)]"
          >
            {t.examUnlocked}
            <span>{t.goToExam} ←</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Lock size={16} /> {t.examLocked}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        {unitExam ? (
          <Link
            href={`/student/exams/${unitExam.id}`}
            className="flex items-center justify-between text-sm font-semibold text-[var(--color-amber)]"
          >
            {t.unitExamUnlocked}
            <span>{t.goToUnitExam} ←</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Lock size={16} /> {t.unitExamLocked}
          </div>
        )}
      </div>
    </section>
  );
}