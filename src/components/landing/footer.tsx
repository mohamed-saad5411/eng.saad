'use client";'
import Link from "next/link";

const copy = {
  ar: {
    tagline: "شرح منظم للرياضيات، الإحصاء، والمحاسبة وإدارة الأعمال — لطلبة الثانوية العامة.",
    programs: "البرامج",
    company: "المنصة",
    links1: [
      { href: "/programs/math-secondary", label: "رياضيات" },
      { href: "/programs/statistics", label: "إحصاء" },
      { href: "/programs/business", label: "محاسبة وإدارة أعمال" },
      { href: "/programs/math-german", label: "Mathematik (ألماني)" },
    ],
    links2: [
      { href: "/about", label: "عن المنصة" },
      { href: "/contact", label: "تواصل معنا" },
    ],
    rights: "جميع الحقوق محفوظة",
  },
  en: {
    tagline: "Structured explanations in Mathematics, Statistics, and Business & Accounting — for secondary students.",
    programs: "Programs",
    company: "Platform",
    links1: [
      { href: "/programs/math-secondary", label: "Mathematics" },
      { href: "/programs/statistics", label: "Statistics" },
      { href: "/programs/business", label: "Business & Accounting" },
      { href: "/programs/math-german", label: "Mathematik (German)" },
    ],
    links2: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    rights: "All rights reserved",
  },
};

export function Footer({ locale }: { locale: "ar" | "en" }) {
  const t = copy[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="block text-lg font-bold">
            {locale === "ar" ? "مهندس سعد للرياضيات" : "Eng. Saad for Mathematics"}
          </span>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--color-muted)]">
            {t.tagline}
          </p>
        </div>

        <div>
          <span className="text-sm font-semibold">{t.programs}</span>
          <ul className="mt-4 flex flex-col gap-3">
            {t.links1.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-sm font-semibold">{t.company}</span>
          <ul className="mt-4 flex flex-col gap-3">
            {t.links2.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] py-5 text-center text-xs text-[var(--color-muted)]">
        © {year} Eng. Saad for Mathematics — {t.rights}
      </div>
    </footer>
  );
}
