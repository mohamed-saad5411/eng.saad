import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات" },
    activeStudents: "طلاب نشطون",
    publishedVideos: "فيديوهات منشورة",
    pendingVerification: "طلبات توثيق معلّقة",
    pendingEssays: "أوراق مقالي تحتاج تصحيح",
    recentEnrollments: "آخر التسجيلات",
    noRecent: "لا يوجد تسجيلات جديدة",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements" },
    activeStudents: "Active students",
    publishedVideos: "Published videos",
    pendingVerification: "Pending verifications",
    pendingEssays: "Essays awaiting grading",
    recentEnrollments: "Recent enrollments",
    noRecent: "No recent enrollments",
  },
};

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = copy[locale];

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .single();

  if (!profile || (profile.role !== "subject_admin" && profile.role !== "super_admin")) {
    redirect("/login");
  }

  const { data: managedSubjects } = await supabase
    .from("admin_subjects")
    .select("subjects ( id, slug, name_ar, name_en )")
    .eq("admin_id", userId);

  const subjectIds = (managedSubjects ?? []).map((s: any) => s.subjects.id);
  // badge just shows "Mathematics" or "Physics" depending on which subjects this admin owns
  const badgeLabel = (managedSubjects ?? [])
    .some((s: any) => s.subjects.slug === "physics")
    ? (locale === "ar" ? "فيزياء" : "Physics")
    : (locale === "ar" ? "رياضيات" : "Mathematics");

  const { count: activeStudents } = await supabase
    .from("students")
    .select("id, programs!inner ( subject_id )", { count: "exact", head: true })
    .in("programs.subject_id", subjectIds)
    .eq("verification_status", "verified");

  const { count: publishedVideos } = await supabase
    .from("videos")
    .select("id, lessons!inner ( units!inner ( terms!inner ( programs!inner ( subject_id ) ) ) )", { count: "exact", head: true })
    .in("lessons.units.terms.programs.subject_id", subjectIds)
    .eq("status", "ready");

  const { count: pendingVerification } = await supabase
    .from("students")
    .select("id, programs!inner ( subject_id )", { count: "exact", head: true })
    .in("programs.subject_id", subjectIds)
    .eq("verification_status", "pending");

  const { count: pendingEssays } = await supabase
    .from("exam_attempts")
    .select("id", { count: "exact", head: true })
    .eq("essay_status", "pending");

  const { data: recentStudents } = await supabase
    .from("students")
    .select("id, created_at, profiles ( full_name ), programs ( title )")
    .in("programs.subject_id", subjectIds)
    .order("created_at", { ascending: false })
    .limit(5);

  const navItems: NavItem[] = [
    { href: "/admin/dashboard", label: t.nav.home, icon: Home },
    { href: "/admin/content", label: t.nav.content, icon: Layers },
    { href: "/admin/students", label: t.nav.students, icon: Users },
    { href: "/admin/exams", label: t.nav.exams, icon: ClipboardCheck },
    { href: "/admin/commerce", label: t.nav.commerce, icon: CreditCard },
    { href: "/admin/announcements", label: t.nav.announcements, icon: Megaphone },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      activeHref="/admin/dashboard"
      userName={profile.full_name}
      badge={badgeLabel}
      locale={locale}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label={t.activeStudents} value={activeStudents ?? 0} />
        <StatCard icon={Layers} label={t.publishedVideos} value={publishedVideos ?? 0} />
        <StatCard icon={ClipboardCheck} label={t.pendingVerification} value={pendingVerification ?? 0} />
        <StatCard icon={ClipboardCheck} label={t.pendingEssays} value={pendingEssays ?? 0} />
      </div>

      <h2 className="mt-10 text-lg font-bold">{t.recentEnrollments}</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        {(recentStudents ?? []).length === 0 ? (
          <p className="p-6 text-sm text-[var(--color-muted)]">{t.noRecent}</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {(recentStudents ?? []).map((s: any) => (
                <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-4 font-medium">{s.profiles.full_name}</td>
                  <td className="p-4 text-[var(--color-muted)]">{s.programs.title}</td>
                  <td className="p-4 text-[var(--color-muted)]">
                    {new Date(s.created_at).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}