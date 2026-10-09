// import { createClient } from "@/lib/supabase/server";
// import { requireAdmin } from "@/lib/require-admin";
// import { buildAdminNavItems } from "@/lib/admin-nav";
// import { DashboardShell } from "@/components/dashboard/shell";

// type Locale = "ar" | "en";
// type Relation<T> = T | T[] | null;
// type Product = { id: string; title: string; price: number; billing_type: string };
// type StudentInfo = { profiles: Relation<{ full_name: string | null }> };
// type Enrollment = {
//   id: string;
//   status: string;
//   created_at: string;
//   expires_at: string | null;
//   students: Relation<StudentInfo>;
// };
// type Payment = {
//   amount: number;
//   currency: string;
//   status: string;
//   paid_at: string | null;
//   created_at: string;
//   students: Relation<StudentInfo>;
// };

// const copy = {
//   ar: {
//     title: "الاشتراكات والمدفوعات",
//     subtitle: "المنتجات والاشتراكات وسجل المدفوعات.",
//     products: "المنتجات",
//     enrollments: "أحدث الاشتراكات",
//     payments: "أحدث المدفوعات",
//     product: "المنتج",
//     price: "السعر",
//     billing: "نوع الدفع",
//     student: "الطالب",
//     status: "الحالة",
//     date: "التاريخ",
//     expires: "ينتهي في",
//     empty: "لا توجد بيانات للعرض.",
//     error: "تعذر تحميل بيانات التجارة.",
//   },
//   en: {
//     title: "Subscriptions & payments",
//     subtitle: "Products, student enrollments, and recent payment records.",
//     products: "Products",
//     enrollments: "Recent enrollments",
//     payments: "Recent payments",
//     product: "Product",
//     price: "Price",
//     billing: "Billing type",
//     student: "Student",
//     status: "Status",
//     date: "Date",
//     expires: "Expires",
//     empty: "No data to display.",
//     error: "Unable to load commerce data.",
//   },
// };

// function firstRelation<T>(relation: Relation<T>): T | null {
//   return Array.isArray(relation) ? relation[0] ?? null : relation;
// }

// export default async function AdminCommercePage({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>;
// }) {
//   const { locale } = await params;
//   const t = copy[locale];
//   const admin = await requireAdmin();
//   const supabase = await createClient();

//   const productsQuery = supabase
//     .from("products")
//     .select("id, title, price, billing_type")
//     .order("title");
//   let enrollmentsQuery = supabase
//     .from("enrollments")
//     .select("id, status, created_at, expires_at, students!inner(profiles(full_name), programs!inner(subject_id))")
//     .order("created_at", { ascending: false })
//     .limit(10);
//   let paymentsQuery = supabase
//     .from("payments")
//     .select("amount, currency, status, paid_at, created_at, students!inner(profiles(full_name), programs!inner(subject_id))")
//     .order("created_at", { ascending: false })
//     .limit(10);

//   if (!admin.isSuperAdmin) {
//     if (admin.managedSubjectIds.length === 0) {
//       const { data: products, error } = await productsQuery;
//       if (error) {
//         console.error("Admin products query failed:", error);
//         throw new Error(t.error, { cause: error });
//       }
//       return (
//         <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/commerce" userName={t.title} badge={t.title} locale={locale}>
//           <h1 className="text-xl font-bold">{t.title}</h1>
//           <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>
//           <ProductList products={(products ?? []) as Product[]} t={t} />
//           <p className="mt-8 text-sm text-[var(--color-muted)]">{t.empty}</p>
//         </DashboardShell>
//       );
//     }
//     enrollmentsQuery = enrollmentsQuery.in("students.programs.subject_id", admin.managedSubjectIds);
//     paymentsQuery = paymentsQuery.in("students.programs.subject_id", admin.managedSubjectIds);
//   }

//   const [productsResult, enrollmentsResult, paymentsResult] = await Promise.all([
//     productsQuery,
//     enrollmentsQuery,
//     paymentsQuery,
//   ]);
//   const error = productsResult.error ?? enrollmentsResult.error ?? paymentsResult.error;
//   if (error) {
//     console.error("Admin commerce query failed:", error);
//     throw new Error(t.error, { cause: error });
//   }

//   const products = (productsResult.data ?? []) as Product[];
//   const enrollments = (enrollmentsResult.data ?? []) as Enrollment[];
//   const payments = (paymentsResult.data ?? []) as Payment[];

//   return (
//     <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/commerce" userName={t.title} badge={t.title} locale={locale}>
//       <h1 className="text-xl font-bold">{t.title}</h1>
//       <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>
//       <ProductList products={products} t={t} />

//       <h2 className="mt-10 text-lg font-bold">{t.enrollments}</h2>
//       {enrollments.length === 0 ? (
//         <p className="mt-4 text-sm text-[var(--color-muted)]">{t.empty}</p>
//       ) : (
//         <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
//           <table className="w-full text-sm">
//             <tbody>
//               {enrollments.map((enrollment) => (
//                 <tr key={enrollment.id} className="border-b border-[var(--color-border)] last:border-0">
//                   <td className="p-4 font-medium">{firstRelation(firstRelation(enrollment.students)?.profiles)?.full_name ?? "—"}</td>
//                   <td className="p-4 text-[var(--color-muted)]">{enrollment.status}</td>
//                   <td className="p-4 text-[var(--color-muted)]">{t.date}: {new Date(enrollment.created_at).toLocaleDateString(locale)}</td>
//                   <td className="p-4 text-[var(--color-muted)]">
//                     {enrollment.expires_at ? `${t.expires}: ${new Date(enrollment.expires_at).toLocaleDateString(locale)}` : "—"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <h2 className="mt-10 text-lg font-bold">{t.payments}</h2>
//       {payments.length === 0 ? (
//         <p className="mt-4 text-sm text-[var(--color-muted)]">{t.empty}</p>
//       ) : (
//         <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
//           <table className="w-full text-sm">
//             <tbody>
//               {payments.map((payment, index) => (
//                 <tr key={`${payment.created_at}-${index}`} className="border-b border-[var(--color-border)] last:border-0">
//                   <td className="p-4 font-medium">{firstRelation(firstRelation(payment.students)?.profiles)?.full_name ?? "—"}</td>
//                   <td className="p-4">{payment.amount} {payment.currency}</td>
//                   <td className="p-4 text-[var(--color-muted)]">{payment.status}</td>
//                   <td className="p-4 text-[var(--color-muted)]">
//                     {new Date(payment.paid_at ?? payment.created_at).toLocaleDateString(locale)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </DashboardShell>
//   );
// }

// function ProductList({
//   products,
//   t,
// }: {
//   products: Product[];
//   t: (typeof copy)[Locale];
// }) {
//   return (
//     <>
//       <h2 className="mt-8 text-lg font-bold">{t.products}</h2>
//       {products.length === 0 ? (
//         <p className="mt-4 text-sm text-[var(--color-muted)]">{t.empty}</p>
//       ) : (
//         <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((product) => (
//             <article key={product.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
//               <h3 className="font-bold">{product.title}</h3>
//               <p className="mt-2 text-sm text-[var(--color-muted)]">{t.price}: {product.price}</p>
//               <p className="mt-1 text-sm text-[var(--color-muted)]">{t.billing}: {product.billing_type}</p>
//             </article>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }


import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getManagedSubjectIds } from "@/lib/admin/managed-subjects";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات", settings: "الإعدادات" },
    title: "الاشتراكات والمدفوعات",
    student: "الطالب",
    program: "البرنامج",
    status: "الحالة",
    amount: "المبلغ",
    noPayments: "لا يوجد مدفوعات بعد.",
    statusLabels: { active: "نشط", expired: "منتهي", pending_payment: "قيد الدفع", cancelled: "ملغي" } as Record<string, string>,
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Subscriptions & Payments",
    student: "Student",
    program: "Program",
    status: "Status",
    amount: "Amount",
    noPayments: "No payments yet.",
    statusLabels: { active: "Active", expired: "Expired", pending_payment: "Pending", cancelled: "Cancelled" } as Record<string, string>,
  },
};

export default async function AdminCommercePage({
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

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, status, students ( profiles ( full_name ) ), programs!inner ( title, subject_id )")
    .in("programs.subject_id", subjectIds)
    .order("created_at", { ascending: false });

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
    <DashboardShell navItems={navItems} activeHref="/admin/commerce" userName={t.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      {(enrollments ?? []).length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted)]">{t.noPayments}</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <tbody>
              {(enrollments ?? []).map((e: any) => (
                <tr key={e.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-4 font-medium">{e.students?.profiles?.full_name}</td>
                  <td className="p-4 text-[var(--color-muted)]">{e.programs.title}</td>
                  <td className="p-4 text-[var(--color-muted)]">{t.statusLabels[e.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}