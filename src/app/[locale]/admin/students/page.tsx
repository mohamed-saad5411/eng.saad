// import { createClient } from "@/lib/supabase/server";
// import { requireAdmin } from "@/lib/require-admin";
// import { buildAdminNavItems } from "@/lib/admin-nav";
// import { DashboardShell } from "@/components/dashboard/shell";
// import { ApproveButton, RejectForm } from "./actions-ui";

// const copy = {
//   ar: {
//     title: "الطلاب",
//     subtitle: "راجع المستندات وامنح التوثيق قبل ما الطالب يقدر يدخل.",
//     filterAll: "الكل",
//     filterPending: "قيد المراجعة",
//     filterVerified: "موثّق",
//     filterRejected: "مرفوض",
//     name: "الاسم",
//     program: "البرنامج",
//     phone: "فون الطالب",
//     parentPhone: "فون ولي الأمر",
//     fatherStatus: "حالة الأب",
//     status: "الحالة",
//     idDoc: "مستند الهوية",
//     deathCert: "شهادة الوفاة",
//     view: "عرض",
//     approve: "توثيق",
//     reject: "رفض",
//     empty: "مفيش طلاب هنا دلوقتي.",
//     fatherLabels: { working: "يعمل", retired: "معاش", deceased: "متوفي" } as Record<string, string>,
//     statusLabels: { pending: "قيد المراجعة", verified: "موثّق", rejected: "مرفوض" } as Record<string, string>,
//   },
//   en: {
//     title: "Students",
//     subtitle: "Review documents and grant verification before a student can access anything.",
//     filterAll: "All",
//     filterPending: "Pending",
//     filterVerified: "Verified",
//     filterRejected: "Rejected",
//     name: "Name",
//     program: "Program",
//     phone: "Student phone",
//     parentPhone: "Parent phone",
//     fatherStatus: "Father's status",
//     status: "Status",
//     idDoc: "ID document",
//     deathCert: "Death certificate",
//     view: "View",
//     approve: "Verify",
//     reject: "Reject",
//     empty: "No students here right now.",
//     fatherLabels: { working: "Working", retired: "Retired", deceased: "Deceased" } as Record<string, string>,
//     statusLabels: { pending: "Pending", verified: "Verified", rejected: "Rejected" } as Record<string, string>,
//   },
// };

// const STATUS_STYLES: Record<string, string> = {
//   pending: "bg-amber-100 text-amber-800",
//   verified: "bg-emerald-100 text-emerald-800",
//   rejected: "bg-red-100 text-red-800",
// };

// export default async function AdminStudentsPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ locale: "ar" | "en" }>;
//   searchParams: Promise<{ status?: string }>;
// }) {
//   const { locale } = await params;
//   const { status } = await searchParams;
//   const t = copy[locale];
//   const admin = await requireAdmin();
//   const supabase = await createClient();

//   let query = supabase
//     .from("students")
//     .select(
//       `
//       id, student_phone, parent_phone, father_status,
//       verification_status, rejection_reason,
//       id_document_path, death_certificate_path,
//       profiles ( full_name, email ),
//       programs ( title, subject_id )
//       `
//     )
//     .order("created_at", { ascending: false });

//   if (!admin.isSuperAdmin) {
//     // RLS already scopes this, but filtering here too means subject_admins
//     // see a clean empty state instead of relying purely on row security.
//     query = query.in(
//       "program_id",
//       (
//         await supabase.from("programs").select("id").in("subject_id", admin.managedSubjectIds)
//       ).data?.map((p) => p.id) ?? []
//     );
//   }

//   if (status && status !== "all") {
//     query = query.eq("verification_status", status);
//   }

//   const { data: students } = await query;

//   const filters = [
//     { value: "all", label: t.filterAll },
//     { value: "pending", label: t.filterPending },
//     { value: "verified", label: t.filterVerified },
//     { value: "rejected", label: t.filterRejected },
//   ];
//   const activeFilter = status ?? "all";

//   return (
//     <DashboardShell
//       navItems={buildAdminNavItems(locale)}
//       activeHref="/admin/students"
//       userName={t.title}
//       badge={t.title}
//       locale={locale}
//     >
//       <h1 className="text-xl font-bold">{t.title}</h1>
//       <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>

//       <div className="mt-6 flex gap-2">
//         {filters.map((f) => (
//           <a
//             key={f.value}
//             href={`?status=${f.value}`}
//             className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
//               activeFilter === f.value
//                 ? "bg-[var(--color-brand)] text-white"
//                 : "bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
//             }`}
//           >
//             {f.label}
//           </a>
//         ))}
//       </div>

//       <div className="mt-6 flex flex-col gap-4">
//         {(students ?? []).length === 0 && (
//           <p className="text-sm text-[var(--color-muted)]">{t.empty}</p>
//         )}

//         {(students ?? []).map((s: any) => (
//           <div key={s.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
//             <div className="flex flex-wrap items-start justify-between gap-3">
//               <div>
//                 <p className="font-bold">{s.profiles?.full_name || "—"}</p>
//                 <p className="text-sm text-[var(--color-muted)]">{s.profiles?.email}</p>
//                 <p className="mt-1 text-sm">{s.programs?.title}</p>
//               </div>
//               <span
//                 className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[s.verification_status]}`}
//               >
//                 {t.statusLabels[s.verification_status]}
//               </span>
//             </div>

//             <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
//               <div>
//                 <dt className="text-[var(--color-muted)]">{t.phone}</dt>
//                 <dd dir="ltr" className="text-right">{s.student_phone}</dd>
//               </div>
//               <div>
//                 <dt className="text-[var(--color-muted)]">{t.parentPhone}</dt>
//                 <dd dir="ltr" className="text-right">{s.parent_phone}</dd>
//               </div>
//               <div>
//                 <dt className="text-[var(--color-muted)]">{t.fatherStatus}</dt>
//                 <dd>{t.fatherLabels[s.father_status]}</dd>
//               </div>
//               <div className="flex gap-3">
//                 <a
//                   href={`/api/admin/documents/${s.id_document_path}`}
//                   target="_blank"
//                   className="text-[var(--color-brand)] underline"
//                 >
//                   {t.idDoc}
//                 </a>
//                 {s.death_certificate_path && (
//                   <a
//                     href={`/api/admin/documents/${s.death_certificate_path}`}
//                     target="_blank"
//                     className="text-[var(--color-brand)] underline"
//                   >
//                     {t.deathCert}
//                   </a>
//                 )}
//               </div>
//             </dl>

//             {s.verification_status === "rejected" && s.rejection_reason && (
//               <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
//                 {s.rejection_reason}
//               </p>
//             )}

//             {s.verification_status === "pending" && (
//               <div className="mt-4 flex flex-wrap items-center gap-3">
//                 <ApproveButton studentId={s.id} label={t.approve} locale={locale} />
//                 <RejectForm studentId={s.id} label={t.reject} locale={locale} />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </DashboardShell>
//   );
// }


import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getManagedSubjectIds } from "@/lib/admin/managed-subjects";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { verifyStudentAction, rejectStudentAction } from "@/actions/admin";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات", settings: "الإعدادات" },
    title: "الطلاب",
    pendingTitle: "طلبات توثيق معلّقة",
    allTitle: "كل الطلاب",
    verify: "توثيق",
    reject: "رفض",
    rejectReason: "سبب الرفض",
    status: { pending: "معلّق", verified: "موثّق", rejected: "مرفوض" } as Record<string, string>,
    noPending: "لا يوجد طلبات معلّقة.",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Students",
    pendingTitle: "Pending verifications",
    allTitle: "All students",
    verify: "Verify",
    reject: "Reject",
    rejectReason: "Rejection reason",
    status: { pending: "Pending", verified: "Verified", rejected: "Rejected" } as Record<string, string>,
    noPending: "No pending requests.",
  },
};

export default async function AdminStudentsPage({
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

  const { data: students } = await supabase
    .from("students")
    .select("id, student_phone, parent_phone, verification_status, created_at, profiles ( full_name ), programs!inner ( title, subject_id )")
    .in("programs.subject_id", subjectIds)
    .order("created_at", { ascending: false });

  const pending = (students ?? []).filter((s: any) => s.verification_status === "pending");
  const rest = (students ?? []).filter((s: any) => s.verification_status !== "pending");

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
    <DashboardShell navItems={navItems} activeHref="/admin/students" userName={t.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      <h2 className="mt-8 text-lg font-bold">{t.pendingTitle}</h2>
      {pending.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-muted)]">{t.noPending}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {pending.map((s: any) => (
            <div key={s.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{s.profiles.full_name}</p>
                  <p className="text-sm text-[var(--color-muted)]">{s.programs.title}</p>
                  <p className="text-sm text-[var(--color-muted)]">{s.student_phone}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <form action={verifyStudentAction}>
                  <input type="hidden" name="student_id" value={s.id} />
                  <button className="rounded-xl bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)]">
                    {t.verify}
                  </button>
                </form>
                <form action={rejectStudentAction} className="flex gap-2">
                  <input type="hidden" name="student_id" value={s.id} />
                  <input
                    type="text"
                    name="rejection_reason"
                    placeholder={t.rejectReason}
                    className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm"
                  />
                  <button className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold">
                    {t.reject}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 text-lg font-bold">{t.allTitle}</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <tbody>
            {rest.map((s: any) => (
              <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-4 font-medium">{s.profiles.full_name}</td>
                <td className="p-4 text-[var(--color-muted)]">{s.programs.title}</td>
                <td className="p-4 text-[var(--color-muted)]">{t.status[s.verification_status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}