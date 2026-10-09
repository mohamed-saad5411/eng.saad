// import { createClient } from "@/lib/supabase/server";
// import { requireAdmin } from "@/lib/require-admin";
// import { buildAdminNavItems } from "@/lib/admin-nav";
// import { DashboardShell } from "@/components/dashboard/shell";
// import { setContentPublished } from "@/actions/admin/catalog";

// type Locale = "ar" | "en";
// type Relation<T> = T | T[] | null;
// type ContentLesson = {
//   id: string;
//   title: string;
//   is_published: boolean;
//   videos: { id: string; kind: string; status: string }[];
// };
// type ContentUnit = { id: string; title: string; is_published: boolean; lessons: ContentLesson[] };
// type ContentTerm = {
//   id: string;
//   name: string;
//   programs: Relation<{ title: string; subject_id: string }>;
//   units: ContentUnit[];
// };

// const copy = {
//   ar: {
//     title: "إدارة المحتوى",
//     subtitle: "البرامج والوحدات والدروس والفيديوهات.",
//     empty: "لا يوجد محتوى متاح.",
//     videos: "فيديو",
//     lessons: "درس",
//     units: "وحدة",
//     published: "منشور",
//     draft: "مسودة",
//     noVideos: "لا توجد فيديوهات",
//     publish: "نشر",
//     unpublish: "إلغاء النشر",
//     error: "تعذر تحميل المحتوى.",
//   },
//   en: {
//     title: "Content",
//     subtitle: "Programs, units, lessons, and videos.",
//     empty: "No content available.",
//     videos: "videos",
//     lessons: "lessons",
//     units: "units",
//     published: "Published",
//     draft: "Draft",
//     noVideos: "No videos",
//     publish: "Publish",
//     unpublish: "Unpublish",
//     error: "Unable to load content.",
//   },
// };

// function firstRelation<T>(relation: Relation<T>): T | null {
//   return Array.isArray(relation) ? relation[0] ?? null : relation;
// }

// export default async function AdminContentPage({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>;
// }) {
//   const { locale } = await params;
//   const t = copy[locale];
//   const admin = await requireAdmin();
//   const supabase = await createClient();

//   let query = supabase
//     .from("terms")
//     .select("id, name, programs!inner(title, subject_id), units(id, title, is_published, lessons(id, title, is_published, videos(id, kind, status)))")
//     .order("sort_order");
//   if (!admin.isSuperAdmin) {
//     if (admin.managedSubjectIds.length === 0) {
//       return (
//         <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/content" userName={t.title} badge={t.title} locale={locale}>
//           <h1 className="text-xl font-bold">{t.title}</h1>
//           <p className="mt-6 text-sm text-[var(--color-muted)]">{t.empty}</p>
//         </DashboardShell>
//       );
//     }
//     query = query.in("programs.subject_id", admin.managedSubjectIds);
//   }

//   const { data, error } = await query;
//   if (error) {
//     console.error("Admin content query failed:", error);
//     throw new Error(t.error, { cause: error });
//   }
//   const terms = (data ?? []) as ContentTerm[];
//   const totals = terms.reduce(
//     (total, term) => {
//       for (const unit of term.units) {
//         total.units += 1;
//         total.lessons += unit.lessons.length;
//         total.videos += unit.lessons.reduce((count, lesson) => count + lesson.videos.length, 0);
//       }
//       return total;
//     },
//     { units: 0, lessons: 0, videos: 0 }
//   );

//   return (
//     <DashboardShell navItems={buildAdminNavItems(locale)} activeHref="/admin/content" userName={t.title} badge={t.title} locale={locale}>
//       <h1 className="text-xl font-bold">{t.title}</h1>
//       <p className="mt-1 text-sm text-[var(--color-muted)]">{t.subtitle}</p>
//       <div className="mt-6 grid gap-4 sm:grid-cols-3">
//         {[
//           [t.units, totals.units],
//           [t.lessons, totals.lessons],
//           [t.videos, totals.videos],
//         ].map(([label, value]) => (
//           <div key={String(label)} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
//             <p className="text-sm text-[var(--color-muted)]">{label}</p>
//             <p className="mt-2 text-2xl font-bold">{value}</p>
//           </div>
//         ))}
//       </div>

//       {terms.length === 0 ? (
//         <p className="mt-6 text-sm text-[var(--color-muted)]">{t.empty}</p>
//       ) : (
//         <div className="mt-8 flex flex-col gap-5">
//           {terms.map((term) => (
//             <section key={term.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
//               <p className="text-xs font-semibold text-[var(--color-brand)]">{firstRelation(term.programs)?.title ?? "—"}</p>
//               <h2 className="mt-1 font-bold">{term.name}</h2>
//               <div className="mt-4 flex flex-col gap-4">
//                 {term.units.map((unit) => (
//                   <div key={unit.id} className="rounded-xl bg-[var(--color-bg)] p-4">
//                     <div className="flex flex-wrap items-center justify-between gap-3">
//                       <h3 className="font-semibold">{unit.title}</h3>
//                       <form action={setContentPublished}>
//                         <input type="hidden" name="content_type" value="unit" />
//                         <input type="hidden" name="content_id" value={unit.id} />
//                         <input type="hidden" name="is_published" value={String(!unit.is_published)} />
//                         <button className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium">
//                           {unit.is_published ? t.unpublish : t.publish}
//                         </button>
//                       </form>
//                     </div>
//                     {unit.lessons.length === 0 ? (
//                       <p className="mt-2 text-sm text-[var(--color-muted)]">{t.empty}</p>
//                     ) : (
//                       <ul className="mt-3 flex flex-col gap-3">
//                         {unit.lessons.map((lesson) => (
//                           <li key={lesson.id} className="flex flex-wrap items-start justify-between gap-3 border-t border-[var(--color-border)] pt-3">
//                             <div>
//                               <p className="text-sm font-medium">{lesson.title}</p>
//                               <p className="mt-1 text-xs text-[var(--color-muted)]">
//                                 {lesson.videos.length ? lesson.videos.map((video) => `${video.kind} · ${video.status}`).join(", ") : t.noVideos}
//                               </p>
//                             </div>
//                             <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lesson.is_published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
//                               {lesson.is_published ? t.published : t.draft}
//                             </span>
//                             <form action={setContentPublished}>
//                               <input type="hidden" name="content_type" value="lesson" />
//                               <input type="hidden" name="content_id" value={lesson.id} />
//                               <input type="hidden" name="is_published" value={String(!lesson.is_published)} />
//                               <button className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium">
//                                 {lesson.is_published ? t.unpublish : t.publish}
//                               </button>
//                             </form>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </section>
//           ))}
//         </div>
//       )}
//     </DashboardShell>
//   );
// }


import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getManagedSubjectIds } from "@/lib/admin/managed-subjects";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { toggleProgramPublishAction } from "@/actions/admin";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات", settings: "الإعدادات" },
    title: "إدارة المحتوى",
    published: "منشور",
    draft: "مسودة",
    unpublish: "إلغاء النشر",
    publish: "نشر",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Content management",
    published: "Published",
    draft: "Draft",
    unpublish: "Unpublish",
    publish: "Publish",
  },
};

export default async function AdminContentPage({
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

  const { data: programs } = await supabase
    .from("programs")
    .select("id, title, slug, is_published")
    .in("subject_id", subjectIds)
    .order("title");

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
    <DashboardShell navItems={navItems} activeHref="/admin/content" userName={t.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <tbody>
            {(programs ?? []).map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      p.is_published
                        ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                        : "bg-[var(--color-bg)] text-[var(--color-muted)]"
                    }`}
                  >
                    {p.is_published ? t.published : t.draft}
                  </span>
                </td>
                <td className="p-4 text-end">
                  <form action={toggleProgramPublishAction}>
                    <input type="hidden" name="program_id" value={p.id} />
                    <input type="hidden" name="next_value" value={String(!p.is_published)} />
                    <button className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold">
                      {p.is_published ? t.unpublish : t.publish}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}