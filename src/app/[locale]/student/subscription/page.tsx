import { redirect } from "next/navigation";
import { Home, BookOpen, ClipboardCheck, CreditCard, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const copy = {
  ar: {
    nav: { home: "الرئيسية", program: "برنامجي", exams: "الامتحانات والنتائج", subscription: "اشتراكي", account: "حسابي" },
    title: "اشتراكك",
    status: "الحالة",
    active: "نشط",
    expired: "منتهي",
    pending: "قيد الدفع",
    cancelled: "ملغي",
    expiresOn: "تاريخ الانتهاء",
    paymentsTitle: "سجل المدفوعات",
    noPayments: "لا يوجد مدفوعات بعد.",
    amount: "المبلغ",
    date: "التاريخ",
  },
  en: {
    nav: { home: "Home", program: "My Program", exams: "Exams & Results", subscription: "Subscription", account: "Account" },
    title: "Your subscription",
    status: "Status",
    active: "Active",
    expired: "Expired",
    pending: "Pending payment",
    cancelled: "Cancelled",
    expiresOn: "Expires on",
    paymentsTitle: "Payment history",
    noPayments: "No payments yet.",
    amount: "Amount",
    date: "Date",
  },
};

export default async function StudentSubscriptionPage({
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
    .select("programs ( title )")
    .eq("id", userId)
    .single();

  if (!student) redirect("/register");
  const program = (student as any).programs;

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("status, expires_at")
    .eq("student_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: payments } = await supabase
    .from("payments")
    .select("amount, currency, status, paid_at, created_at")
    .eq("student_id", userId)
    .order("created_at", { ascending: false });

  const statusLabels: Record<string, string> = {
    active: t.active,
    expired: t.expired,
    pending_payment: t.pending,
    cancelled: t.cancelled,
  };

  const navItems: NavItem[] = [
    { href: "/student/dashboard", label: t.nav.home, icon: Home },
    { href: "/student/program", label: t.nav.program, icon: BookOpen },
    { href: "/student/exams", label: t.nav.exams, icon: ClipboardCheck },
    { href: "/student/subscription", label: t.nav.subscription, icon: CreditCard },
    { href: "/student/account", label: t.nav.account, icon: User },
  ];

  return (
    <DashboardShell navItems={navItems} activeHref="/student/subscription" userName={program.title} badge={program.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted)]">{t.status}</span>
          <span className="font-semibold">{statusLabels[enrollment?.status ?? "pending_payment"]}</span>
        </div>
        {enrollment?.expires_at && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted)]">{t.expiresOn}</span>
            <span className="font-semibold">{new Date(enrollment.expires_at).toLocaleDateString(locale)}</span>
          </div>
        )}
      </div>

      <h2 className="mt-8 text-lg font-bold">{t.paymentsTitle}</h2>
      {(payments ?? []).length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-muted)]">{t.noPayments}</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <tbody>
              {(payments ?? []).map((p: any, i: number) => (
                <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-4 font-medium">{p.amount} {p.currency}</td>
                  <td className="p-4 text-[var(--color-muted)]">{p.status}</td>
                  <td className="p-4 text-[var(--color-muted)]">
                    {new Date(p.paid_at ?? p.created_at).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}