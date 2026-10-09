import { redirect } from "next/navigation";
import { Home, Layers, Users, ClipboardCheck, CreditCard, Megaphone, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getManagedSubjectIds } from "@/lib/admin/managed-subjects";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { postAnnouncementAction } from "@/actions/announcements";

const copy = {
  ar: {
    nav: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات", announcements: "الإعلانات", settings: "الإعدادات" },
    title: "الإعلانات",
    subject: "المادة (اختياري — سيب فاضي لإعلان عام)",
    allSubjects: "كل المواد",
    titleField: "عنوان الإعلان",
    body: "نص الإعلان",
    post: "نشر الإعلان",
    noAnnouncements: "لا يوجد إعلانات بعد.",
  },
  en: {
    nav: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments", announcements: "Announcements", settings: "Settings" },
    title: "Announcements",
    subject: "Subject (optional — leave blank for a platform-wide announcement)",
    allSubjects: "All subjects",
    titleField: "Announcement title",
    body: "Announcement body",
    post: "Post announcement",
    noAnnouncements: "No announcements yet.",
  },
};

export default async function AdminAnnouncementsPage({
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

  const { data: subjects } = await supabase.from("subjects").select("id, name_ar, name_en").in("id", subjectIds);

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title_ar, body_ar, created_at, subject_id")
    .or(`subject_id.in.(${subjectIds.join(",")}),subject_id.is.null`)
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
    <DashboardShell navItems={navItems} activeHref="/admin/announcements" userName={t.title} locale={locale}>
      <h1 className="text-xl font-bold">{t.title}</h1>

      <form action={postAnnouncementAction} className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <select name="subject_id" className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm">
          <option value="">{t.allSubjects}</option>
          {(subjects ?? []).map((s) => (
            <option key={s.id} value={s.id}>{locale === "ar" ? s.name_ar : s.name_en}</option>
          ))}
        </select>
        <input type="text" name="title_ar" placeholder={t.titleField} required className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm" />
        <textarea name="body_ar" placeholder={t.body} required rows={3} className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm" />
        <button className="self-start rounded-xl bg-[var(--color-ink)] px-5 py-2 text-sm font-semibold text-[var(--color-bg)]">
          {t.post}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {(announcements ?? []).length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">{t.noAnnouncements}</p>
        ) : (
          (announcements ?? []).map((a) => (
            <div key={a.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <p className="font-bold">{a.title_ar}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{a.body_ar}</p>
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}