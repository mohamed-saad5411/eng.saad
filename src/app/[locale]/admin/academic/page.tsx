// import { createClient } from "@/lib/supabase/server";
// import { requireAdmin } from "@/lib/require-admin";
// import { buildAdminNavItems } from "@/lib/admin-nav";
// import { DashboardShell } from "@/components/dashboard/shell";
// import { setProgramPublished } from "@/actions/admin/catalog";

// type Locale = "ar" | "en";
// type Relation<T> = T | T[] | null;
// type ProgramRow = {
//   id: string;
//   slug: string;
//   title: string;
//   is_published: boolean;
//   subjects: Relation<{ name_ar: string; name_en: string }>;
//   curriculums: Relation<{ code: string }>;
//   languages: Relation<{ code: string }>;
//   grades: Relation<{ name: string }>;
//   tracks: Relation<{ name_ar: string; name_en: string }>;
// };
// type GradeRow = { id: string; name: string; level_order: number };
// type TrackRow = { id: string; code: string; name_ar: string; name_en: string };
// type CodeRow = { id: string; code: string };

// const copy = {
//   ar: {
//     title: "المواد والبرامج",
//     subtitle: "البرامج الأكاديمية وحالة نشرها.",
//     empty: "لا توجد برامج متاحة.",
//     subject: "المادة",
//     curriculum: "المسار الدراسي",
//     grade: "الصف",
//     language: "اللغة",
//     status: "الحالة",
//     published: "منشور",
//     draft: "مسودة",
//     publish: "نشر",
//     unpublish: "إلغاء النشر",
//     error: "تعذر تحميل البرامج الأكاديمية.",
//     references: "البيانات المرجعية",
//     grades: "الصفوف",
//     tracks: "المسارات",
//     languages: "اللغات",
//     curriculums: "المناهج",
//   },
//   en: {
//     title: "Academic programs",
//     subtitle: "Program catalog and publication status.",
//     empty: "No programs available.",
//     subject: "Subject",
//     curriculum: "Curriculum",
//     grade: "Grade",
//     language: "Language",
//     status: "Status",
//     published: "Published",
//     draft: "Draft",
//     publish: "Publish",
//     unpublish: "Unpublish",
//     error: "Unable to load academic programs.",
//     references: "Reference data",
//     grades: "Grades",
//     tracks: "Tracks",
//     languages: "Languages",
//     curriculums: "Curriculums",
//   },
// };

// function firstRelation<T>(relation: Relation<T>): T | null {
//   return Array.isArray(relation) ? relation[0] ?? null : relation;
// }

// export default async function AdminAcademicPage({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>;
// }) {
//   const { locale } = await params;
//   const t = copy[locale];
//   const admin = await requireAdmin();
//   const supabase = await createClient();

//   let query = supabase
//     .from("programs")
//     .select(
//       "id, slug, title, is_published, subjects(name_ar, name_en), curriculums(code), languages(code), grades(name), tracks(name_ar, name_en)"
//     )
//     .order("title");
//   if (!admin.isSuperAdmin) {
//     if (admin.managedSubjectIds.length > 0) query = query.in("subject_id", admin.managedSubjectIds);
//   }

//   const [programResult, gradesResult, tracksResult, languagesResult, curriculumsResult] = await Promise.all([
//     admin.isSuperAdmin || admin.managedSubjectIds.length > 0
//       ? query
//       : Promise.resolve({ data: [], error: null }),
//     supabase.from("grades").select("id, name, level_order").order("level_order"),
//     supabase.from("tracks").select("id, code, name_ar, name_en").order("code"),
//     supabase.from("languages").select("id, code").order("code"),
//     supabase.from("curriculums").select("id, code").order("code"),
//   ]);
//   const error =
//     programResult.error ??
//     gradesResult.error ??
//     tracksResult.error ??
//     languagesResult.error ??
//     curriculumsResult.error;
//   if (error) {
//     console.error("Admin academic data query failed:", error);
//     throw new Error(t.error, { cause: error });
//   }
//   const programs = (programResult.data ?? []) as ProgramRow[];
//   const grades = (gradesResult.data ?? []) as GradeRow[];
//   const tracks = (tracksResult.data ?? []) as TrackRow[];
//   const languages = (languagesResult.data ?? []) as CodeRow[];
//   const curriculums = (curriculumsResult.data ?? []) as CodeRow[];

//   return (
//     <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/academic" userName={t.title} badge={t.title} locale={locale}>
//       <h1 className="text-xl font-bold">{t.title}</h1>
//       <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>

//       <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5">
//         <h2 className="font-bold">{t.references}</h2>
//         <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           <ReferenceList title={t.grades} values={grades.map((grade) => `${grade.name} · ${grade.level_order}`)} />
//           <ReferenceList title={t.tracks} values={tracks.map((track) => locale === "ar" ? track.name_ar : track.name_en)} />
//           <ReferenceList title={t.languages} values={languages.map((language) => language.code)} />
//           <ReferenceList title={t.curriculums} values={curriculums.map((curriculum) => curriculum.code)} />
//         </div>
//       </section>

//       <h2 className="mt-8 text-lg font-bold">{t.title}</h2>
//       {programs.length === 0 ? (
//         <p className="mt-6 text-sm text-[var(--color-muted)]">{t.empty}</p>
//       ) : (
//         <div className="mt-6 flex flex-col gap-4">
//           {programs.map((program) => (
//             <section key={program.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
//               <div className="flex flex-wrap items-start justify-between gap-4">
//                 <div>
//                   <h2 className="font-bold">{program.title}</h2>
//                   <p className="mt-1 text-sm text-[var(--color-muted)]" dir="ltr">{program.slug}</p>
//                 </div>
//                 <span className={`rounded-full px-3 py-1 text-xs font-semibold ${program.is_published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
//                   {program.is_published ? t.published : t.draft}
//                 </span>
//               </div>
//               <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
//                 <div><dt className="text-[var(--color-muted)]">{t.subject}</dt><dd>{locale === "ar" ? firstRelation(program.subjects)?.name_ar : firstRelation(program.subjects)?.name_en}</dd></div>
//                 <div><dt className="text-[var(--color-muted)]">{t.curriculum}</dt><dd>{firstRelation(program.tracks) ? (locale === "ar" ? firstRelation(program.tracks)?.name_ar : firstRelation(program.tracks)?.name_en) : firstRelation(program.curriculums)?.code ?? "—"}</dd></div>
//                 <div><dt className="text-[var(--color-muted)]">{t.grade}</dt><dd>{firstRelation(program.grades)?.name ?? "—"}</dd></div>
//                 <div><dt className="text-[var(--color-muted)]">{t.language}</dt><dd dir="ltr">{firstRelation(program.languages)?.code ?? "—"}</dd></div>
//               </dl>
//               <form action={setProgramPublished} className="mt-4">
//                 <input type="hidden" name="program_id" value={program.id} />
//                 <input type="hidden" name="is_published" value={String(!program.is_published)} />
//                 <button className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm font-medium hover:border-[var(--color-brand)]">
//                   {program.is_published ? t.unpublish : t.publish}
//                 </button>
//               </form>
//             </section>
//           ))}
//         </div>
//       )}
//     </DashboardShell>
//   );
// }

// function ReferenceList({ title, values }: { title: string; values: string[] }) {
//   return (
//     <div>
//       <h3 className="text-sm font-semibold text-[var(--color-muted)]">{title}</h3>
//       <ul className="mt-2 flex flex-col gap-1 text-sm">
//         {values.length ? values.map((value) => <li key={value}>{value}</li>) : <li>—</li>}
//       </ul>
//     </div>
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
    title: "المواد والمناهج",
    note: "البيانات دي (المواد، المناهج، الصفوف، التخصصات) بتتعدّل حاليًا من قاعدة البيانات مباشرة، مش من هنا.",
    programsCount: "برنامج",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Subjects & Curricula",
    note: "This reference data (subjects, curricula, grades, tracks) is currently managed directly in the database, not from here.",
    programsCount: "programs",
  },
};

export default async function AdminAcademicPage({
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

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name_ar, name_en, programs ( id )")
    .in("id", subjectIds);

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
    <DashboardShell navItems={navItems} activeHref="/admin/academic" userName={t.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{t.note}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(subjects ?? []).map((s: any) => (
          <div key={s.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <h3 className="font-bold">{locale === "ar" ? s.name_ar : s.name_en}</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {s.programs?.length ?? 0} {t.programsCount}
            </p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}