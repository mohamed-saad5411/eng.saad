import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";

type ProgramMeta = {
  title: string;
  grade: string;
  terms: { slug: string; name: string; unitsCount: number }[];
};

const copy = {
  ar: { label: "اختر الفصل الدراسي", body: "اختر الترم اللي عايز تراجع محتواه." },
  en: { label: "Choose the term", body: "Pick the term you want to review." },
};

// Placeholder — moves to services/programs once Supabase is live.
const programsData: Record<string, ProgramMeta> = {
  "math-ar-1": {
    title: "رياضيات — ١ ث",
    grade: "١ ث",
    terms: [
      { slug: "term-1", name: "الفصل الدراسي الأول", unitsCount: 3 },
      { slug: "term-2", name: "الفصل الدراسي الثاني", unitsCount: 3 },
    ],
  },
  "math-ar-2": {
    title: "رياضيات — ٢ ث",
    grade: "٢ ث",
    terms: [
      { slug: "term-1", name: "الفصل الدراسي الأول", unitsCount: 3 },
      { slug: "term-2", name: "الفصل الدراسي الثاني", unitsCount: 2 },
    ],
  },
  "math-ar-3": {
    title: "رياضيات — ٣ ث",
    grade: "٣ ث",
    terms: [
      { slug: "term-1", name: "الفصل الدراسي الأول", unitsCount: 4 },
      { slug: "term-2", name: "الفصل الدراسي الثاني", unitsCount: 3 },
    ],
  },
  "physics-national": {
    title: "Physics — National",
    grade: "1-3 Sec",
    terms: [
      { slug: "term-1", name: "Term 1", unitsCount: 3 },
      { slug: "term-2", name: "Term 2", unitsCount: 3 },
    ],
  },
};

export default async function ProgramTermPickerPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; subject: string; programSlug: string }>;
}) {
  const { locale, subject, programSlug } = await params;
  const program = programsData[programSlug];

  if (!program) notFound();

  const t = copy[locale];

  return (
    <section className="container-page py-20">
      <div className="max-w-xl">
        <span className="text-sm text-[var(--color-muted)]">{program.grade}</span>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">{program.title}</h1>
        <p className="mt-4 leading-7 text-[var(--color-muted)]">{t.body}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-2xl">
        {program.terms.map((term) => (
          <Link
            key={term.slug}
            href={`/programs/${subject}/${programSlug}/${term.slug}`}
            className="group flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-8 transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-bg)]">
              <BookOpen size={22} className="text-[var(--color-brand)]" />
            </span>
            <h2 className="text-xl font-bold">{term.name}</h2>
            <span className="text-sm text-[var(--color-muted)]">
              {term.unitsCount} {locale === "ar" ? "وحدات" : "units"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}