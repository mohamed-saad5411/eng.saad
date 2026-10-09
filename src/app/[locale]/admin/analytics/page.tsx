// import { createClient } from "@/lib/supabase/server";
// import { requireAdmin } from "@/lib/require-admin";
// import { buildAdminNavItems } from "@/lib/admin-nav";
// import { DashboardShell } from "@/components/dashboard/shell";
// import { StatCard } from "@/components/dashboard/stat-card";
// import { BookOpen, ClipboardCheck, PlayCircle, Users } from "lucide-react";

// type Locale = "ar" | "en";

// const copy = {
//   ar: {
//     title: "التحليلات",
//     subtitle: "ملخص للمحتوى والطلاب والامتحانات.",
//     students: "إجمالي الطلاب",
//     verifiedStudents: "طلاب موثّقون",
//     programs: "البرامج",
//     videos: "الفيديوهات",
//     exams: "الامتحانات",
//     attempts: "محاولات الامتحان",
//     error: "تعذر تحميل بيانات التحليلات.",
//   },
//   en: {
//     title: "Analytics",
//     subtitle: "Overview of students, learning content, and exam activity.",
//     students: "Total students",
//     verifiedStudents: "Verified students",
//     programs: "Programs",
//     videos: "Videos",
//     exams: "Exams",
//     attempts: "Exam attempts",
//     error: "Unable to load analytics.",
//   },
// };

// export default async function AdminAnalyticsPage({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>;
// }) {
//   const { locale } = await params;
//   const t = copy[locale];
//   const admin = await requireAdmin();
//   const supabase = await createClient();
//   const hasSubjects = admin.isSuperAdmin || admin.managedSubjectIds.length > 0;

//   let studentsQuery = supabase
//     .from("students")
//     .select("id, programs!inner(subject_id)", { count: "exact", head: true });
//   let verifiedStudentsQuery = supabase
//     .from("students")
//     .select("id, programs!inner(subject_id)", { count: "exact", head: true })
//     .eq("verification_status", "verified");
//   let programsQuery = supabase
//     .from("programs")
//     .select("id", { count: "exact", head: true });
//   let videosQuery = supabase
//     .from("videos")
//     .select("id, lessons!inner(units!inner(terms!inner(programs!inner(subject_id))))", { count: "exact", head: true });
//   let lessonExamsQuery = supabase
//     .from("exams")
//     .select("id, lessons!inner(units!inner(terms!inner(programs!inner(subject_id))))", { count: "exact", head: true })
//     .eq("scope", "lesson");
//   let unitExamsQuery = supabase
//     .from("exams")
//     .select("id, units!inner(terms!inner(programs!inner(subject_id)))", { count: "exact", head: true })
//     .eq("scope", "unit");
//   const attemptsQuery = supabase
//     .from("exam_attempts")
//     .select("id", { count: "exact", head: true });

//   if (!admin.isSuperAdmin) {
//     studentsQuery = studentsQuery.in("programs.subject_id", admin.managedSubjectIds);
//     verifiedStudentsQuery = verifiedStudentsQuery.in("programs.subject_id", admin.managedSubjectIds);
//     programsQuery = programsQuery.in("subject_id", admin.managedSubjectIds);
//     videosQuery = videosQuery.in("lessons.units.terms.programs.subject_id", admin.managedSubjectIds);
//     lessonExamsQuery = lessonExamsQuery.in("lessons.units.terms.programs.subject_id", admin.managedSubjectIds);
//     unitExamsQuery = unitExamsQuery.in("units.terms.programs.subject_id", admin.managedSubjectIds);
//   }

//   if (!hasSubjects) {
//     return (
//       <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/analytics" userName={t.title} badge={t.title} locale={locale}>
//         <h1 className="text-xl font-bold">{t.title}</h1>
//         <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>
//       </DashboardShell>
//     );
//   }

//   const [
//     studentsResult,
//     verifiedStudentsResult,
//     programsResult,
//     videosResult,
//     lessonExamsResult,
//     unitExamsResult,
//     attemptsResult,
//   ] = await Promise.all([
//     studentsQuery,
//     verifiedStudentsQuery,
//     programsQuery,
//     videosQuery,
//     lessonExamsQuery,
//     unitExamsQuery,
//     attemptsQuery,
//   ]);
//   const error =
//     studentsResult.error ??
//     verifiedStudentsResult.error ??
//     programsResult.error ??
//     videosResult.error ??
//     lessonExamsResult.error ??
//     unitExamsResult.error ??
//     attemptsResult.error;
//   if (error) {
//     console.error("Admin analytics query failed:", error);
//     throw new Error(t.error, { cause: error });
//   }

//   return (
//     <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/analytics" userName={t.title} badge={t.title} locale={locale}>
//       <h1 className="text-xl font-bold">{t.title}</h1>
//       <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>
//       <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <StatCard icon={Users} label={t.students} value={studentsResult.count ?? 0} />
//         <StatCard icon={Users} label={t.verifiedStudents} value={verifiedStudentsResult.count ?? 0} />
//         <StatCard icon={BookOpen} label={t.programs} value={programsResult.count ?? 0} />
//         <StatCard icon={PlayCircle} label={t.videos} value={videosResult.count ?? 0} />
//         <StatCard icon={ClipboardCheck} label={t.exams} value={(lessonExamsResult.count ?? 0) + (unitExamsResult.count ?? 0)} />
//         <StatCard icon={ClipboardCheck} label={t.attempts} value={attemptsResult.count ?? 0} />
//       </div>
//     </DashboardShell>
//   );
// }


import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone, PlayCircle, Award, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getManagedSubjectIds } from "@/lib/admin/managed-subjects";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { StatCard } from "@/components/dashboard/stat-card";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات", settings: "الإعدادات" },
    title: "إحصائيات",
    totalViews: "مشاهدات فيديو مكتملة",
    gradedExams: "امتحانات مُصحَّحة",
    verifiedStudents: "طلاب موثّقون",
    publishedPrograms: "برامج منشورة",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Analytics",
    totalViews: "Completed video views",
    gradedExams: "Graded exams",
    verifiedStudents: "Verified students",
    publishedPrograms: "Published programs",
  },
};

export default async function AdminAnalyticsPage({
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

  const { count: publishedPrograms } = await supabase
    .from("programs")
    .select("id", { count: "exact", head: true })
    .in("subject_id", subjectIds)
    .eq("is_published", true);

  const { count: verifiedStudents } = await supabase
    .from("students")
    .select("id, programs!inner ( subject_id )", { count: "exact", head: true })
    .in("programs.subject_id", subjectIds)
    .eq("verification_status", "verified");

  const { count: gradedExams } = await supabase
    .from("exam_attempts")
    .select("id", { count: "exact", head: true })
    .eq("status", "graded");

  const { count: totalViews } = await supabase
    .from("video_views")
    .select("id", { count: "exact", head: true })
    .not("completed_at", "is", null);

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
    <DashboardShell navItems={navItems} activeHref="/admin/analytics" userName={t.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Layers} label={t.publishedPrograms} value={publishedPrograms ?? 0} />
        <StatCard icon={Users} label={t.verifiedStudents} value={verifiedStudents ?? 0} />
        <StatCard icon={Award} label={t.gradedExams} value={gradedExams ?? 0} />
        <StatCard icon={PlayCircle} label={t.totalViews} value={totalViews ?? 0} />
      </div>
    </DashboardShell>
  );
}