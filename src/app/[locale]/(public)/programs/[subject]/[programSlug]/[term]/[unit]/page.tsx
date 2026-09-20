import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock, PlayCircle } from "lucide-react";

type LessonMeta = { slug: string; title: string };

const copy = {
  ar: {
    label: "دروس الوحدة",
    body: "قايمة الدروس. سجّل دخولك عشان تفتح الشرح والفيديو.",
    loginCta: "سجّل دخول لمشاهدة الدرس",
  },
  en: {
    label: "Lessons in this unit",
    body: "Lesson list. Log in to unlock the explanation and video.",
    loginCta: "Log in to watch",
  },
};

// Placeholder — moves to services/content once Supabase is live.
const lessonsData: Record<string, Record<string, Record<string, { unitTitle: string; lessons: LessonMeta[] }>>> = {
  "math-ar-1": {
    "term-1": {
      algebra: {
        unitTitle: "الجبر",
        lessons: [
          { slug: "l1", title: "الأعداد النسبية وغير النسبية" },
          { slug: "l2", title: "العمليات على الأقواس" },
          { slug: "l3", title: "التحليل إلى عوامل" },
          { slug: "l4", title: "حل المعادلات من الدرجة الأولى" },
        ],
      },
      geometry: {
        unitTitle: "الهندسة",
        lessons: [
          { slug: "l1", title: "المسلمات والنظريات الأساسية" },
          { slug: "l2", title: "تطابق المثلثات" },
        ],
      },
      trigonometry: {
        unitTitle: "حساب المثلثات",
        lessons: [
          { slug: "l1", title: "النسب المثلثية للزاوية الحادة" },
        ],
      },
    },
  },
  "physics-national": {
    "term-1": {
      mechanics: {
        unitTitle: "Mechanics",
        lessons: [
          { slug: "l1", title: "Scalars and vectors" },
          { slug: "l2", title: "Motion in a straight line" },
          { slug: "l3", title: "Newton's laws of motion" },
        ],
      },
    },
  },
};

export default async function UnitLessonsPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; subject: string; programSlug: string; term: string; unit: string }>;
}) {
  const { locale, subject, programSlug, term, unit } = await params;
  const unitData = lessonsData[programSlug]?.[term]?.[unit];

  if (!unitData) notFound();

  const t = copy[locale];

  return (
    <section className="container-page py-20">
      <div className="max-w-xl">
        <span className="text-sm font-medium text-[var(--color-brand)]">{unitData.unitTitle}</span>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t.label}</h1>
        <p className="mt-4 leading-7 text-[var(--color-muted)]">{t.body}</p>
      </div>

      <div className="mt-10 flex max-w-2xl flex-col divide-y divide-[var(--color-border)] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white">
        {unitData.lessons.map((lesson, i) => (
          // TODO: once auth exists, this should carry a `redirect` param back to
          // /student/programs/.../lessons/[slug] after successful login.
          <Link
            key={lesson.slug}
            href="/login"
            className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-[var(--color-bg)]"
          >
            <div className="flex items-center gap-4">
              <span className="math-mono text-sm text-[var(--color-muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-medium">{lesson.title}</span>
            </div>
            <Lock size={16} className="text-[var(--color-muted)]" />
          </Link>
        ))}
      </div>
    </section>
  );
}