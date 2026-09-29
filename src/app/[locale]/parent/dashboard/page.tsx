import { redirect } from "next/navigation";
import { Home, Users, CreditCard, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const copy = {
  ar: {
    nav: { home: "الرئيسية", children: "أطفالي", commerce: "الاشتراكات والمدفوعات", notifications: "الإشعارات" },
    noChildrenTitle: "لسه ما ربطتش أي طالب",
    noChildrenBody: "ابحث برقم تليفون الطالب عشان تبعت طلب ربط.",
    searchPlaceholder: "رقم تليفون الطالب",
    searchCta: "ابحث",
    progress: "نسبة الإنجاز",
    status: "حالة الاشتراك",
    active: "نشط",
    expired: "منتهي",
    pending: "قيد الدفع",
  },
  en: {
    nav: { home: "Home", children: "My Children", commerce: "Subscriptions & Payments", notifications: "Notifications" },
    noChildrenTitle: "No students linked yet",
    noChildrenBody: "Search by the student's phone number to send a link request.",
    searchPlaceholder: "Student's phone number",
    searchCta: "Search",
    progress: "Progress",
    status: "Subscription status",
    active: "Active",
    expired: "Expired",
    pending: "Pending payment",
  },
};

export default async function ParentDashboardPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = copy[locale];

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userId).single();

  const { data: links } = await supabase
    .from("student_parents")
    .select("student_id, students ( id, profiles ( full_name ), programs ( title ), verification_status )")
    .eq("parent_id", userId);

  const children = links ?? [];

  // one enrollment status + rough progress per child, fetched in parallel
  const childCards = await Promise.all(
    children.map(async (link: any) => {
      const studentId = link.student_id;

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("status")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { count: totalLessons } = await supabase
        .from("lessons")
        .select("id, units!inner ( terms!inner ( programs!inner ( id ) ) )", { count: "exact", head: true })
        .eq("units.terms.programs.id", link.students.programs?.id ?? "");

      const { count: completedLessons } = await supabase
        .from("video_views")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId)
        .not("completed_at", "is", null);

      const progressPct = totalLessons ? Math.round(((completedLessons ?? 0) / totalLessons) * 100) : 0;

      return {
        name: link.students.profiles.full_name,
        program: link.students.programs.title,
        enrollmentStatus: enrollment?.status ?? "pending_payment",
        progressPct,
      };
    })
  );

  const navItems: NavItem[] = [
    { href: "/parent/dashboard", label: t.nav.home, icon: Home },
    { href: "/parent/children", label: t.nav.children, icon: Users },
    { href: "/parent/commerce", label: t.nav.commerce, icon: CreditCard },
    { href: "/parent/notifications", label: t.nav.notifications, icon: Bell },
  ];

  const statusLabel = (s: string) =>
    s === "active" ? t.active : s === "expired" ? t.expired : t.pending;

  return (
    <DashboardShell
      navItems={navItems}
      activeHref="/parent/dashboard"
      userName={profile?.full_name ?? ""}
      locale={locale}
    >
      {childCards.length === 0 ? (
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center">
          <h2 className="text-lg font-bold">{t.noChildrenTitle}</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{t.noChildrenBody}</p>
          {/* TODO: wire to a Server Action calling the find_student_by_phone RPC,
              then inserting a parent_link_requests row */}
          <form className="mx-auto mt-6 flex max-w-sm gap-2">
            <input
              type="tel"
              placeholder={t.searchPlaceholder}
              className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm"
            />
            <button className="rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white">
              {t.searchCta}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {childCards.map((c) => (
            <div key={c.name} className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
              <h3 className="font-bold">{c.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{c.program}</p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-bg)]">
                <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${c.progressPct}%` }} />
              </div>
              <p className="mt-2 text-xs text-[var(--color-muted)]">{t.progress}: {c.progressPct}%</p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted)]">{t.status}</span>
                <span className="font-semibold">{statusLabel(c.enrollmentStatus)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}