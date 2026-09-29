import Link from "next/link";
import { Sigma, Atom } from "lucide-react";

const copy = {
  ar: {
    label: "البرامج",
    title: "اختر المادة الأول",
    body: "بعد ما تختار المادة، هتشوف كل البرامج المتاحة ليها في صفحة واحدة.",
  },
  en: {
    label: "Programs",
    title: "Choose a subject",
    body: "After picking a subject, you'll see every program available for it on one page.",
  },
};

const subjects = {
  ar: [
    { slug: "math", icon: Sigma, title: "الرياضيات", body: "رياضيات، إحصاء، ومحاسبة وإدارة أعمال — عربي، إنجليزي، وألماني." },
    { slug: "physics", icon: Atom, title: "الفيزياء", body: "National، IGCSE، وAmerican — بالإنجليزي." },
  ],
  en: [
    { slug: "math", icon: Sigma, title: "Mathematics", body: "Math, Statistics, and Business & Accounting — Arabic, English, and German." },
    { slug: "physics", icon: Atom, title: "Physics", body: "National, IGCSE, and American curricula — in English." },
  ],
};

export default async function ProgramsPage({ params }: { params:  Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as "ar" | "en";
  const t = copy[locale];

  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="text-sm font-medium text-[var(--color-brand)]">{t.label}</span>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t.title}</h1>
        <p className="mt-4 leading-7 text-[var(--color-muted)]">{t.body}</p>
      </div>

      <div className="mx-auto mt-14 grid max-w-2xl gap-6 sm:grid-cols-2">
        {subjects[locale].map(({ slug, icon: Icon, title, body }) => (
          <Link
            key={slug}
            href={`/programs/${slug}`}
            className="group flex flex-col items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-bg)]">
              <Icon size={28} className="text-[var(--color-brand)]" />
            </span>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm leading-7 text-[var(--color-muted)]">{body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}