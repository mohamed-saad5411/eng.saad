import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { signOutAction } from "@/actions/auth";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات", settings: "الإعدادات" },
    title: "الإعدادات",
    name: "الاسم",
    email: "البريد الإلكتروني",
    role: "الدور",
    mathAdmin: "مدرّس رياضيات",
    physicsAdmin: "مدرّس فيزياء",
    signOut: "تسجيل الخروج",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Settings",
    name: "Name",
    email: "Email",
    role: "Role",
    mathAdmin: "Mathematics teacher",
    physicsAdmin: "Physics teacher",
    signOut: "Sign out",
  },
};

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = copy[locale];

  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", userId).single();

  const { data: managedSubjects } = await supabase
    .from("admin_subjects")
    .select("subjects ( slug )")
    .eq("admin_id", userId);

  const isPhysics = (managedSubjects ?? []).some((s: any) => s.subjects.slug === "physics");
  const roleLabel = isPhysics ? t.physicsAdmin : t.mathAdmin;

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
    <DashboardShell navItems={navItems} activeHref="/admin/settings" userName={profile?.full_name ?? ""} badge={roleLabel} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      <div className="mt-6 max-w-sm rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <div className="flex items-center justify-between py-2 text-sm">
          <span className="text-[var(--color-muted)]">{t.name}</span>
          <span className="font-semibold">{profile?.full_name}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--color-border)] py-2 text-sm">
          <span className="text-[var(--color-muted)]">{t.email}</span>
          <span className="font-semibold">{profile?.email}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--color-border)] py-2 text-sm">
          <span className="text-[var(--color-muted)]">{t.role}</span>
          <span className="font-semibold">{roleLabel}</span>
        </div>
      </div>

      <form action={signOutAction} className="mt-6">
        <button className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]">
          {t.signOut}
        </button>
      </form>
    </DashboardShell>
  );
}