import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/require-admin";
import { buildAdminNavItems } from "@/lib/admin-nav";
import { DashboardShell } from "@/components/dashboard/shell";
import { ApproveButton, RejectForm } from "./actions-ui";

const copy = {
  ar: {
    title: "الطلاب",
    subtitle: "راجع المستندات وامنح التوثيق قبل ما الطالب يقدر يدخل.",
    filterAll: "الكل",
    filterPending: "قيد المراجعة",
    filterVerified: "موثّق",
    filterRejected: "مرفوض",
    name: "الاسم",
    program: "البرنامج",
    phone: "فون الطالب",
    parentPhone: "فون ولي الأمر",
    fatherStatus: "حالة الأب",
    status: "الحالة",
    idDoc: "مستند الهوية",
    deathCert: "شهادة الوفاة",
    view: "عرض",
    approve: "توثيق",
    reject: "رفض",
    empty: "مفيش طلاب هنا دلوقتي.",
    fatherLabels: { working: "يعمل", retired: "معاش", deceased: "متوفي" } as Record<string, string>,
    statusLabels: { pending: "قيد المراجعة", verified: "موثّق", rejected: "مرفوض" } as Record<string, string>,
  },
  en: {
    title: "Students",
    subtitle: "Review documents and grant verification before a student can access anything.",
    filterAll: "All",
    filterPending: "Pending",
    filterVerified: "Verified",
    filterRejected: "Rejected",
    name: "Name",
    program: "Program",
    phone: "Student phone",
    parentPhone: "Parent phone",
    fatherStatus: "Father's status",
    status: "Status",
    idDoc: "ID document",
    deathCert: "Death certificate",
    view: "View",
    approve: "Verify",
    reject: "Reject",
    empty: "No students here right now.",
    fatherLabels: { working: "Working", retired: "Retired", deceased: "Deceased" } as Record<string, string>,
    statusLabels: { pending: "Pending", verified: "Verified", rejected: "Rejected" } as Record<string, string>,
  },
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function AdminStudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  const t = copy[locale];
  const admin = await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("students")
    .select(
      `
      id, student_phone, parent_phone, father_status,
      verification_status, rejection_reason,
      id_document_path, death_certificate_path,
      profiles ( full_name, email ),
      programs ( title, subject_id )
      `
    )
    .order("created_at", { ascending: false });

  if (!admin.isSuperAdmin) {
    // RLS already scopes this, but filtering here too means subject_admins
    // see a clean empty state instead of relying purely on row security.
    query = query.in(
      "program_id",
      (
        await supabase.from("programs").select("id").in("subject_id", admin.managedSubjectIds)
      ).data?.map((p) => p.id) ?? []
    );
  }

  if (status && status !== "all") {
    query = query.eq("verification_status", status);
  }

  const { data: students } = await query;

  const filters = [
    { value: "all", label: t.filterAll },
    { value: "pending", label: t.filterPending },
    { value: "verified", label: t.filterVerified },
    { value: "rejected", label: t.filterRejected },
  ];
  const activeFilter = status ?? "all";

  return (
    <DashboardShell
      navItems={buildAdminNavItems(locale)}
      activeHref="/admin/students"
      userName={t.title}
      badge={t.title}
      locale={locale}
    >
      <h1 className="text-xl font-bold">{t.title}</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>

      <div className="mt-6 flex gap-2">
        {filters.map((f) => (
          <a
            key={f.value}
            href={`?status=${f.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === f.value
                ? "bg-[var(--color-brand)] text-white"
                : "bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {(students ?? []).length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">{t.empty}</p>
        )}

        {(students ?? []).map((s: any) => (
          <div key={s.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{s.profiles?.full_name || "—"}</p>
                <p className="text-sm text-[var(--color-muted)]">{s.profiles?.email}</p>
                <p className="mt-1 text-sm">{s.programs?.title}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[s.verification_status]}`}
              >
                {t.statusLabels[s.verification_status]}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-[var(--color-muted)]">{t.phone}</dt>
                <dd dir="ltr" className="text-right">{s.student_phone}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">{t.parentPhone}</dt>
                <dd dir="ltr" className="text-right">{s.parent_phone}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)]">{t.fatherStatus}</dt>
                <dd>{t.fatherLabels[s.father_status]}</dd>
              </div>
              <div className="flex gap-3">
                <a
                  href={`/api/admin/documents/${s.id_document_path}`}
                  target="_blank"
                  className="text-[var(--color-brand)] underline"
                >
                  {t.idDoc}
                </a>
                {s.death_certificate_path && (
                  <a
                    href={`/api/admin/documents/${s.death_certificate_path}`}
                    target="_blank"
                    className="text-[var(--color-brand)] underline"
                  >
                    {t.deathCert}
                  </a>
                )}
              </div>
            </dl>

            {s.verification_status === "rejected" && s.rejection_reason && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {s.rejection_reason}
              </p>
            )}

            {s.verification_status === "pending" && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <ApproveButton studentId={s.id} label={t.approve} locale={locale} />
                <RejectForm studentId={s.id} label={t.reject} locale={locale} />
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}