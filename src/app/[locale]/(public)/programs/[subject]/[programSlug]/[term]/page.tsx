import Link from "next/link";
import { notFound } from "next/navigation";
import { Shapes } from "lucide-react";

type UnitMeta = { slug: string; title: string; lessonsCount: number };

const copy = {
  ar: { label: "وحدات الفصل الدراسي", body: "اختر الوحدة عشان تشوف الدروس اللي جواها." },
  en: { label: "Units in this term", body: "Pick a unit to see the lessons inside it." },
};

// Placeholder — moves to services/content once Supabase is live.
const unitsData: Record<string, Record<string, { termName: string; units: UnitMeta[] }>> = {
  "math-ar-1": {
    "term-1": {
      termName: "الفصل الدراسي الأول",
      units: [
        { slug: "algebra", title: "الجبر", lessonsCount: 8 },
        { slug: "geometry", title: "الهندسة", lessonsCount: 6 },
        { slug: "trigonometry", title: "حساب المثلثات", lessonsCount: 5 },
      ],
    },
    "term-2": {
      termName: "الفصل الدراسي الثاني",
      units: [
        { slug: "algebra-2", title: "الجبر المتقدم", lessonsCount: 7 },
        { slug: "geometry-2", title: "الهندسة التحليلية", lessonsCount: 6 },
        { slug: "statistics-intro", title: "مقدمة في الإحصاء", lessonsCount: 4 },
      ],
    },
  },
  "physics-national": {
    "term-1": {
      termName: "Term 1",
      units: [
        { slug: "mechanics", title: "Mechanics", lessonsCount: 7 },
        { slug: "waves", title: "Waves", lessonsCount: 5 },
        { slug: "thermodynamics", title: "Thermodynamics", lessonsCount: 4 },
      ],
    },
    "term-2": {
      termName: "Term 2",
      units: [
        { slug: "electricity", title: "Electricity", lessonsCount: 6 },
        { slug: "magnetism", title: "Magnetism", lessonsCount: 5 },
      ],
    },
  },
};

export default async function TermUnitsPage({
  params,
}: {
  params:  Promise<{ locale: string; subject: string; programSlug: string; term: string }>;
}) {
  const { locale: rawLocale, subject, programSlug, term } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as "ar" | "en";
  const termData = unitsData[programSlug]?.[term];

  if (!termData) notFound();

  const t = copy[locale];

  return (
    <section className="container-page py-20">
      <div className="max-w-xl">
        <span className="text-sm font-medium text-[var(--color-brand)]">{termData.termName}</span>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t.label}</h1>
        <p className="mt-4 leading-7 text-[var(--color-muted)]">{t.body}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {termData.units.map((unit) => (
          <Link
            key={unit.slug}
            href={`/programs/${subject}/${programSlug}/${term}/${unit.slug}`}
            className="group flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-7 transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-bg)]">
              <Shapes size={22} className="text-[var(--color-brand)]" />
            </span>
            <h2 className="text-lg font-bold">{unit.title}</h2>
            <span className="text-sm text-[var(--color-muted)]">
              {unit.lessonsCount} {locale === "ar" ? "دروس" : "lessons"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}