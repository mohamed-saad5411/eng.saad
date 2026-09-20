"use client";

import { useState } from "react";
import { Menu, X, Languages } from "lucide-react";
import { Link, usePathname, useRouter } from "@/lib/i18n/routing";

type NavbarProps = {
  locale: "ar" | "en";
};

const copy = {
  ar: {
    brandLine1: "المهندسان",
    brandLine2: "للرياضيات والفيزياء",
    links: [
      { href: "/", label: "الرئيسية" },
      { href: "/programs", label: "البرامج" },
      { href: "/about", label: "عن المنصة" },
      { href: "/contact", label: "تواصل معنا" },
    ],
    login: "تسجيل الدخول",
    cta: "ابدأ الآن",
    switchTo: "English",
  },
  en: {
    brandLine1: "Thr Ingeneers",
    brandLine2: "for Mathematics and Physics",
    links: [
      { href: "/", label: "Home" },
      { href: "/programs", label: "Programs" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    login: "Log in",
    cta: "Get started",
    switchTo: "العربية",
  },
};

export function Navbar({ locale }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const t = copy[locale];
  const pathname = usePathname();
  const router = useRouter();
  const otherLocale = locale === "ar" ? "en" : "ar";

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="leading-tight">
          <span className="block text-base font-bold text-[var(--color-ink)]">
            {t.brandLine1}
          </span>
          <span className="block text-xs font-medium text-[var(--color-muted)]">
            {t.brandLine2}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={switchLocale}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            <Languages size={16} />
            {t.switchTo}
          </button>
          <Link href="/login" className="text-sm font-medium text-[var(--color-ink)]">
            {t.login}
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t.cta}
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border)] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {t.links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium">
                {link.label}
              </Link>
            ))}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <Languages size={16} />
              {t.switchTo}
            </button>
            <Link
              href="/register"
              className="mt-2 rounded-xl bg-[var(--color-ink)] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              {t.cta}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}