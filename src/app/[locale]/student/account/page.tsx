import { redirect } from "next/navigation";
import { Home, BookOpen, ClipboardCheck, CreditCard, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { signOutAction } from "@/actions/auth";

const copy = {
  ar: {
    nav: { home: "الرئيسية", program: "برنامجي", exams: "الامتحانات والنتائج", subscription: "اشتراكي", account: "حسابي" },
    title: "حسابي",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم التليفون",
    signOut: "تسجيل الخروج",
  },
  en: {
    nav: { home: "Home", program: "My Program", exams: "Exams & Results", subscription: "Subscription", account: "Account" },
    title: "My account",
    name: "Name",
    email: "Email",
    phone: "Phone",
    signOut: "Sign out",
  },
};

export default async function StudentAccountPage({
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
    .select("full_name, email, phone")
    .eq("id", userId)
    .single();

  const { data: student } = await supabase
    .from("students")
    .select("programs ( title )")
    .eq("id", userId)
    .single();

  const program = (student as any)?.programs;

  const navItems: NavItem[] = [
    { href: "/student/dashboard", label: t.nav.home, icon: Home },
    { href: "/student/program", label: t.nav.program, icon: BookOpen },
    { href: "/student/exams", label: t.nav.exams, icon: ClipboardCheck },
    { href: "/student/subscription", label: t.nav.subscription, icon: CreditCard },
    { href: "/student/account", label: t.nav.account, icon: User },
  ];

  return (
    <DashboardShell navItems={navItems} activeHref="/student/account" userName={profile?.full_name ?? ""} badge={program?.title} locale={locale}>
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
          <span className="text-[var(--color-muted)]">{t.phone}</span>
          <span className="font-semibold">{profile?.phone}</span>
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