
// import { redirect } from "next/navigation";
// import { Home, BookOpen, ClipboardCheck, CreditCard, User } from "lucide-react";
// import { createClient } from "@/lib/supabase/server";
// import { getCurrentUserId } from "@/lib/auth/current-user";
// import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

// const copy = {
//   ar: {
//     nav: { home: "الرئيسية", program: "برنامجي", exams: "الامتحانات والنتائج", subscription: "اشتراكي", account: "حسابي" },
//     continueLabel: "أكمل من حيث توقفت",
//     progressLabel: "نسبة إنجازك",
//     noProgress: "لسه ما بدأتش أي درس",
//     startNow: "ابدأ الآن",
//     unitsTitle: "وحدات برنامجك",
//   },
//   en: {
//     nav: { home: "Home", program: "My Program", exams: "Exams & Results", subscription: "Subscription", account: "Account" },
//     continueLabel: "Continue where you left off",
//     progressLabel: "Your progress",
//     noProgress: "You haven't started any lesson yet",
//     startNow: "Start now",
//     unitsTitle: "Units in your program",
//   },
// };

// function mark(label: string, start: number) {
//   console.log(`[dashboard] ${label}: ${Date.now() - start}ms`);
// }

// export default async function StudentDashboardPage({
//   params,
// }: {
//   params: Promise<{ locale: "ar" | "en" }>;
// }) {
//   const t0 = Date.now();
//   const { locale } = await params;
//   const t = copy[locale];
//   mark("params resolved", t0);

//   const userId = await getCurrentUserId();
//   mark("getCurrentUserId", t0);
//   console.log("[dashboard] userId =", userId);
//   if (!userId) redirect("/login");

//   const supabase = await createClient();
//   mark("createClient", t0);

//   const { data: student, error: studentError } = await supabase
//     .from("students")
//     .select("id, programs ( id, title, slug )")
//     .eq("id", userId)
//     .single();
//   mark("students query", t0);
//   console.log("[dashboard] student =", JSON.stringify(student), "error =", studentError);

//   if (!student) redirect("/register");

//   const program = (student as any).programs;

//   const { data: terms, error: termsError } = await supabase
//     .from("terms")
//     .select("id, name, units ( id, title, slug, lessons ( id, title, slug ) )")
//     .eq("program_id", program.id)
//     .order("sort_order");
//   mark("terms query", t0);
//   console.log("[dashboard] terms error =", termsError);

//   const allLessons = (terms ?? []).flatMap((term: any) =>
//     (term.units ?? []).flatMap((u: any) => u.lessons ?? [])
//   );

//   const { data: views, error: viewsError } = await supabase
//     .from("video_views")
//     .select("video_id, completed_at, videos ( lesson_id )")
//     .eq("student_id", userId);
//   mark("video_views query", t0);
//   console.log("[dashboard] views error =", viewsError);

//   const completedLessonIds = new Set(
//     (views ?? [])
//       .filter((v: any) => v.completed_at)
//       .map((v: any) => v.videos?.lesson_id)
//   );

//   const progressPct = allLessons.length
//     ? Math.round((completedLessonIds.size / allLessons.length) * 100)
//     : 0;

//   const nextLesson = allLessons.find((l: any) => !completedLessonIds.has(l.id));

//   const navItems: NavItem[] = [
//     { href: "/student/dashboard", label: t.nav.home, icon: Home },
//     { href: "/student/program", label: t.nav.program, icon: BookOpen },
//     { href: "/student/exams", label: t.nav.exams, icon: ClipboardCheck },
//     { href: "/student/subscription", label: t.nav.subscription, icon: CreditCard },
//     { href: "/student/account", label: t.nav.account, icon: User },
//   ];

//   mark("before render", t0);

//   return (
//     <DashboardShell
//       navItems={navItems}
//       activeHref="/student/dashboard"
//       userName={program.title}
//       badge={program.title}
//       locale={locale}
//     >
//       <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
//         <span className="text-sm font-semibold text-[var(--color-muted)]">{t.continueLabel}</span>

//         {nextLesson ? (
//           <>
//             <p className="mt-2 text-lg font-bold">{nextLesson.title}</p>
//             <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--color-bg)]">
//               <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${progressPct}%` }} />
//             </div>
//             <p className="mt-3 text-sm text-[var(--color-muted)]">
//               {t.progressLabel}: {progressPct}%
//             </p>
//           </>
//         ) : (
//           <p className="mt-3 text-sm text-[var(--color-muted)]">{t.noProgress}</p>
//         )}
//       </div>

//       <h2 className="mt-10 text-lg font-bold">{t.unitsTitle}</h2>
//       <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {(terms ?? []).flatMap((term: any) =>
//           (term.units ?? []).map((unit: any) => {
//             const total = unit.lessons?.length ?? 0;
//             const done = (unit.lessons ?? []).filter((l: any) => completedLessonIds.has(l.id)).length;
//             return (
//               <div key={unit.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
//                 <h3 className="font-bold">{unit.title}</h3>
//                 <p className="mt-1 text-sm text-[var(--color-muted)]">
//                   {done}/{total} {locale === "ar" ? "دروس" : "lessons"}
//                 </p>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </DashboardShell>
//   );
// }


import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, ClipboardCheck, CreditCard, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const copy = {
  ar: {
    nav: { home: "الرئيسية", program: "برنامجي", exams: "الامتحانات والنتائج", subscription: "اشتراكي", account: "حسابي" },
    continueLabel: "أكمل من حيث توقفت",
    progressLabel: "نسبة إنجازك",
    noProgress: "لسه ما بدأتش أي درس",
    startNow: "ابدأ الآن",
    unitsTitle: "وحدات برنامجك",
  },
  en: {
    nav: { home: "Home", program: "My Program", exams: "Exams & Results", subscription: "Subscription", account: "Account" },
    continueLabel: "Continue where you left off",
    progressLabel: "Your progress",
    noProgress: "You haven't started any lesson yet",
    startNow: "Start now",
    unitsTitle: "Units in your program",
  },
};

export default async function StudentDashboardPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = copy[locale];

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("id, programs ( id, title, slug )")
    .eq("id", userId)
    .single();

  // Not registered / no program chosen yet — shouldn't normally happen since
  // registration requires picking a program, but guard anyway.
  if (!student) redirect("/register");

  const program = (student as any).programs;

  const { data: terms } = await supabase
    .from("terms")
    .select("id, name, units ( id, title, slug, lessons ( id, title, slug ) )")
    .eq("program_id", program.id)
    .order("sort_order");

  // flatten every lesson for progress calculation, keeping parent ids so we
  // can link straight into /student/programs/.../lessons/[lessonId]
  const allLessons = (terms ?? []).flatMap((term: any) =>
    (term.units ?? []).flatMap((u: any) =>
      (u.lessons ?? []).map((l: any) => ({ ...l, termId: term.id, unitId: u.id }))
    )
  );

  const { data: views } = await supabase
    .from("video_views")
    .select("video_id, completed_at, videos ( lesson_id )")
    .eq("student_id", userId);

  const completedLessonIds = new Set(
    (views ?? [])
      .filter((v: any) => v.completed_at)
      .map((v: any) => v.videos?.lesson_id)
  );

  const progressPct = allLessons.length
    ? Math.round((completedLessonIds.size / allLessons.length) * 100)
    : 0;

  const nextLesson = allLessons.find((l: any) => !completedLessonIds.has(l.id));

  const navItems: NavItem[] = [
    { href: "/student/dashboard", label: t.nav.home, icon: Home },
    { href: "/student/program", label: t.nav.program, icon: BookOpen },
    { href: "/student/exams", label: t.nav.exams, icon: ClipboardCheck },
    { href: "/student/subscription", label: t.nav.subscription, icon: CreditCard },
    { href: "/student/account", label: t.nav.account, icon: User },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      activeHref="/student/dashboard"
      userName={program.title}
      badge={program.title}
      locale={locale}
    >
      {/* continue-where-you-left-off card, same visual language as the Hero */}
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
        <span className="text-sm font-semibold text-[var(--color-muted)]">{t.continueLabel}</span>

        {nextLesson ? (
          <>
            <Link
              href={`/student/programs/${program.id}/terms/${nextLesson.termId}/units/${nextLesson.unitId}/lessons/${nextLesson.id}`}
              className="mt-2 block text-lg font-bold hover:text-[var(--color-brand)]"
            >
              {nextLesson.title}
            </Link>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--color-bg)]">
              <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              {t.progressLabel}: {progressPct}%
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-muted)]">{t.noProgress}</p>
        )}
      </div>

      {/* units list */}
      <h2 className="mt-10 text-lg font-bold">{t.unitsTitle}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(terms ?? []).flatMap((term: any) =>
          (term.units ?? []).map((unit: any) => {
            const total = unit.lessons?.length ?? 0;
            const done = (unit.lessons ?? []).filter((l: any) => completedLessonIds.has(l.id)).length;
            return (
              <div key={unit.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <h3 className="font-bold">{unit.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {done}/{total} {locale === "ar" ? "دروس" : "lessons"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}