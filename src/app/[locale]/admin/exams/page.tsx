// import { createClient } from "@/lib/supabase/server";
// import { requireAdmin } from "@/lib/require-admin";
// import { buildAdminNavItems } from "@/lib/admin-nav";
// import { DashboardShell } from "@/components/dashboard/shell";
// import { gradeEssayAction } from "@/actions/admin/exams";
// import { setExamPublished } from "@/actions/admin/catalog";

// type Locale = "ar" | "en";
// type ExamRow = {
//   id: string;
//   scope: string;
//   is_published: boolean;
//   passing_score: number;
//   lessons?: { title: string } | { title: string }[] | null;
//   units?: { title: string } | { title: string }[] | null;
// };
// type EssayAttempt = {
//   id: string;
//   student_id: string;
//   submitted_at: string | null;
//   attempt_answers: {
//     answer_text: string | null;
//     exam_questions: { question_text: string } | { question_text: string }[] | null;
//   }[];
// };
// const copy = {
//   ar: {
//     title: "الامتحانات",
//     subtitle: "الامتحانات المنشورة وأوراق المقالي التي تنتظر التصحيح.",
//     examList: "قائمة الامتحانات",
//     essayQueue: "أوراق مقالي تنتظر التصحيح",
//     empty: "لا توجد بيانات للعرض.",
//     published: "منشور",
//     draft: "مسودة",
//     passingScore: "درجة النجاح",
//     scope: "النطاق",
//     student: "الطالب",
//     submitted: "تاريخ التسليم",
//     question: "السؤال",
//     answer: "الإجابة",
//     score: "الدرجة",
//     grade: "حفظ الدرجة",
//     error: "تعذر تحميل بيانات الامتحانات.",
//     publish: "نشر",
//     unpublish: "إلغاء النشر",
//   },
//   en: {
//     title: "Exams",
//     subtitle: "Published exams and essay submissions awaiting grading.",
//     examList: "Exam list",
//     essayQueue: "Essays awaiting grading",
//     empty: "No data to display.",
//     published: "Published",
//     draft: "Draft",
//     passingScore: "Passing score",
//     scope: "Scope",
//     student: "Student",
//     submitted: "Submitted",
//     question: "Question",
//     answer: "Answer",
//     score: "Score",
//     grade: "Save grade",
//     error: "Unable to load exam data.",
//     publish: "Publish",
//     unpublish: "Unpublish",
//   },
// };

// function relationOne<T>(relation: T | T[] | null | undefined): T | null {
//   return Array.isArray(relation) ? relation[0] ?? null : relation ?? null;
// }

// export default async function AdminExamsPage({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>;
// }) {
//   const { locale } = await params;
//   const t = copy[locale];
//   const admin = await requireAdmin();
//   const supabase = await createClient();

//   let lessonExamsQuery = supabase
//     .from("exams")
//     .select("id, scope, is_published, passing_score, lessons!inner(title, units!inner(terms!inner(programs!inner(subject_id))))")
//     .eq("scope", "lesson")
//     .order("id");
//   let unitExamsQuery = supabase
//     .from("exams")
//     .select("id, scope, is_published, passing_score, units!inner(title, terms!inner(programs!inner(subject_id)))")
//     .eq("scope", "unit")
//     .order("id");

//   if (!admin.isSuperAdmin) {
//     lessonExamsQuery = lessonExamsQuery.in("lessons.units.terms.programs.subject_id", admin.managedSubjectIds);
//     unitExamsQuery = unitExamsQuery.in("units.terms.programs.subject_id", admin.managedSubjectIds);
//   }

//   const [lessonExamsResult, unitExamsResult] = await Promise.all([
//     lessonExamsQuery,
//     unitExamsQuery,
//   ]);
//   const examError = lessonExamsResult.error ?? unitExamsResult.error;
//   if (examError) {
//     console.error("Admin exams query failed:", examError);
//     throw new Error(t.error, { cause: examError });
//   }
//   const exams = [
//     ...((lessonExamsResult.data ?? []) as ExamRow[]),
//     ...((unitExamsResult.data ?? []) as ExamRow[]),
//   ];
//   const examIds = exams.map((exam) => exam.id);

//   let attempts: EssayAttempt[] = [];
//   if (examIds.length > 0) {
//     const { data, error } = await supabase
//       .from("exam_attempts")
//       .select("id, student_id, submitted_at, attempt_answers(answer_text, exam_questions(question_text))")
//       .eq("essay_status", "pending")
//       .in("exam_id", examIds)
//       .order("submitted_at", { ascending: true })
//       .limit(30);
//     if (error) {
//       console.error("Admin essay queue query failed:", error);
//       throw new Error(t.error, { cause: error });
//     }
//     attempts = (data ?? []) as EssayAttempt[];
//   }

//   return (
//     <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/exams" userName={t.title} badge={t.title} locale={locale}>
//       <h1 className="text-xl font-bold">{t.title}</h1>
//       <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>

//       <h2 className="mt-8 text-lg font-bold">{t.examList}</h2>
//       {exams.length === 0 ? (
//         <p className="mt-4 text-sm text-[var(--color-muted)]">{t.empty}</p>
//       ) : (
//         <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
//           <table className="w-full text-sm">
//             <tbody>
//               {exams.map((exam) => {
//                 const lesson = relationOne(exam.lessons);
//                 const unit = relationOne(exam.units);
//                 return (
//                   <tr key={exam.id} className="border-b border-[var(--color-border)] last:border-0">
//                     <td className="p-4 font-medium">{lesson?.title ?? unit?.title ?? "—"}</td>
//                     <td className="p-4 text-[var(--color-muted)]">{exam.scope}</td>
//                     <td className="p-4 text-[var(--color-muted)]">{t.passingScore}: {exam.passing_score}</td>
//                     <td className="p-4">
//                       <span className={`rounded-full px-3 py-1 text-xs font-semibold ${exam.is_published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
//                         {exam.is_published ? t.published : t.draft}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <form action={setExamPublished}>
//                         <input type="hidden" name="exam_id" value={exam.id} />
//                         <input type="hidden" name="is_published" value={String(!exam.is_published)} />
//                         <button className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium">
//                           {exam.is_published ? t.unpublish : t.publish}
//                         </button>
//                       </form>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <h2 className="mt-10 text-lg font-bold">{t.essayQueue}</h2>
//       {attempts.length === 0 ? (
//         <p className="mt-4 text-sm text-[var(--color-muted)]">{t.empty}</p>
//       ) : (
//         <div className="mt-4 flex flex-col gap-4">
//           {attempts.map((attempt) => (
//             <article key={attempt.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
//               <p className="text-sm text-[var(--color-muted)]">{t.student}: {attempt.student_id}</p>
//               <p className="mt-1 text-sm text-[var(--color-muted)]">
//                 {t.submitted}: {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString(locale) : "—"}
//               </p>
//               <div className="mt-4 flex flex-col gap-3">
//                 {attempt.attempt_answers.map((answer, index) => {
//                   const question = relationOne(answer.exam_questions);
//                   if (!answer.answer_text) return null;
//                   return (
//                     <div key={`${attempt.id}-${index}`} className="rounded-xl bg-[var(--color-bg)] p-4">
//                       <p className="text-sm font-semibold">{t.question}: {question?.question_text ?? "—"}</p>
//                       <p className="mt-2 whitespace-pre-wrap text-sm">{t.answer}: {answer.answer_text}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//               <form action={gradeEssayAction} className="mt-4 flex flex-wrap items-end gap-3">
//                 <input type="hidden" name="attempt_id" value={attempt.id} />
//                 <label className="text-sm">
//                   <span className="mb-1 block text-[var(--color-muted)]">{t.score}</span>
//                   <input name="essay_score" type="number" min="0" step="0.5" required className="w-28 rounded-lg border border-[var(--color-border)] px-3 py-2" />
//                 </label>
//                 <button className="rounded-xl bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)]">
//                   {t.grade}
//                 </button>
//               </form>
//             </article>
//           ))}
//         </div>
//       )}
//     </DashboardShell>
//   );
// }

import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getManagedSubjectIds } from "@/lib/admin/managed-subjects";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { gradeEssayAction } from "@/actions/admin";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات", settings: "الإعدادات" },
    title: "تصحيح المقالي",
    noEssays: "لا يوجد أوراق مقالي محتاجة تصحيح.",
    mcqScore: "درجة الاختياري",
    essayScore: "درجة المقالي",
    submit: "حفظ الدرجة",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Essay grading",
    noEssays: "No essays awaiting grading.",
    mcqScore: "MCQ score",
    essayScore: "Essay score",
    submit: "Save score",
  },
};

export default async function AdminExamsPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = copy[locale];

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const subjectIds = await getManagedSubjectIds(userId);
  const supabase = await createClient();

  const { data: attempts } = await supabase
    .from("exam_attempts")
    .select(
      `
      id, mcq_score, essay_status,
      profiles:student_id ( full_name ),
      exams ( id, units ( title, terms ( programs!inner ( subject_id ) ) ) )
    `
    )
    .eq("essay_status", "pending");

  const relevant = (attempts ?? []).filter((a: any) =>
    subjectIds.includes(a.exams?.units?.terms?.programs?.subject_id)
  );

  const navItems: NavItem[] = [
    { href: "/admin/dashboard", label: t.nav.home, icon: Home },
    { href: "/admin/content", label: t.nav.content, icon: Layers },
    { href: "/admin/students", label: t.nav.students, icon: Users },
    { href: "/admin/exams", label: t.nav.exams, icon: ClipboardCheck },
    { href: "/admin/commerce", label: t.nav.commerce, icon: CreditCard },
    { href: "/admin/announcements", label: t.nav.announcements, icon: Megaphone },
    { href: "/admin/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <DashboardShell navItems={navItems} activeHref="/admin/exams" userName={t.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      {relevant.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted)]">{t.noEssays}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {relevant.map((a: any) => (
            <div key={a.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <p className="font-bold">{a.profiles.full_name}</p>
              <p className="text-sm text-[var(--color-muted)]">{a.exams.units.title}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{t.mcqScore}: {a.mcq_score ?? 0}</p>

              <form action={gradeEssayAction} className="mt-3 flex items-center gap-2">
                <input type="hidden" name="attempt_id" value={a.id} />
                <input
                  type="number"
                  name="essay_score"
                  placeholder={t.essayScore}
                  required
                  className="w-32 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
                />
                <button className="rounded-xl bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)]">
                  {t.submit}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}