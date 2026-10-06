import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, ClipboardCheck, CreditCard, User, PlayCircle, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const copy = {
  ar: {
    nav: { home: "الرئيسية", program: "برنامجي", exams: "الامتحانات والنتائج", subscription: "اشتراكي", account: "حسابي" },
    title: "برنامجك الكامل",
  },
  en: {
    nav: { home: "Home", program: "My Program", exams: "Exams & Results", subscription: "Subscription", account: "Account" },
    title: "Your full program",
  },
};

export default async function StudentProgramPage({
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
    .select("programs ( id, title )")
    .eq("id", userId)
    .single();

  if (!student) redirect("/register");
  const program = (student as any).programs;

  const { data: terms } = await supabase
    .from("terms")
    .select("id, name, slug, units ( id, title, slug, lessons ( id, title, slug, unit_id ) )")
    .eq("program_id", program.id)
    .order("sort_order");

  const { data: views } = await supabase
    .from("video_views")
    .select("completed_at, videos ( lesson_id )")
    .eq("student_id", userId);

  const completedLessonIds = new Set(
    (views ?? []).filter((v: any) => v.completed_at).map((v: any) => v.videos?.lesson_id)
  );

  const navItems: NavItem[] = [
    { href: "/student/dashboard", label: t.nav.home, icon: Home },
    { href: "/student/program", label: t.nav.program, icon: BookOpen },
    { href: "/student/exams", label: t.nav.exams, icon: ClipboardCheck },
    { href: "/student/subscription", label: t.nav.subscription, icon: CreditCard },
    { href: "/student/account", label: t.nav.account, icon: User },
  ];

  return (
    <DashboardShell navItems={navItems} activeHref="/student/program" userName={program.title} badge={program.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      <div className="mt-6 flex flex-col gap-8">
        {(terms ?? []).map((term: any) => (
          <div key={term.id}>
            <h2 className="text-sm font-semibold text-[var(--color-brand)]">{term.name}</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(term.units ?? []).map((unit: any) => (
                <div key={unit.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                  <h3 className="font-bold">{unit.title}</h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {(unit.lessons ?? []).map((lesson: any) => {
                      const done = completedLessonIds.has(lesson.id);
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/student/programs/${program.id}/terms/${term.id}/units/${unit.id}/lessons/${lesson.id}`}
                            className="flex items-center gap-2 text-sm hover:text-[var(--color-brand)]"
                          >
                            {done ? (
                              <PlayCircle size={14} className="text-[var(--color-brand)]" />
                            ) : (
                              <Lock size={14} className="text-[var(--color-muted)]" />
                            )}
                            <span className={done ? "" : "text-[var(--color-muted)]"}>{lesson.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}