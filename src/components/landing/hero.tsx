import Link from "next/link";

const copy = {
  ar: {
    badge: "منصة تعليمية للمرحلة الثانوية",
    title1: "افهم الرياضيات والفيزياء",
    title2: "بطريقة أبسط وأوضح.",
    body: "محتوى منظم، شرح بالفيديو، وتدريبات تساعدك تفهم كل خطوة — رياضيات، فيزياء، وإحصاء، ومحاسبة وإدارة أعمال.",
    primaryCta: "اختر برنامجك",
    secondaryCta: "تعرف على المنصة",
    lessonLabel: "الدرس 01",
    lessonTitle: "نظرية ذات الحدين",
    resumeLabel: "أكمل من حيث توقفت",
  },
  en: {
    badge: "A platform for secondary students",
    title1: "Understand math, physics, and more",
    title2: "the clearer way.",
    body: "Structured content, video explanations, and practice that help you understand every step — Math, Physics, Statistics, and Business & Accounting.",
    primaryCta: "Choose your program",
    secondaryCta: "About the platform",
    lessonLabel: "Lesson 01",
    lessonTitle: "The Binomial Theorem",
    resumeLabel: "Resume where you left off",
  },
};

export function Hero({ locale }: { locale: "ar" | "en" }) {
  const t = copy[locale];

  return (
    <section className="grid-texture relative overflow-hidden">
      <div className="container-page grid items-center gap-14 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-block rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-sm text-[var(--color-muted)]">
            {t.badge}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] md:text-6xl">
            {t.title1}
            <br />
            <span className="text-[var(--color-brand)]">{t.title2}</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--color-muted)]">
            {t.body}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/programs"
              className="rounded-xl bg-[var(--color-ink)] px-7 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t.primaryCta}
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-[var(--color-border)] bg-white px-7 py-4 text-sm font-semibold text-[var(--color-ink)]"
            >
              {t.secondaryCta}
            </Link>
          </div>
        </div>

        {/* Math-visual card replaces a stock photo */}
        <div className="relative">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-muted)]">
                {t.lessonLabel}
              </span>
              <span className="h-2 w-2 rounded-full bg-[var(--color-amber)]" />
            </div>

            <p className="mt-2 text-lg font-bold">{t.lessonTitle}</p>

            <div className="math-mono mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] py-10 text-center text-3xl text-[var(--color-ink)]">
              (a + b)ⁿ = Σ C(n,k) aⁿ⁻ᵏ bᵏ
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[var(--color-bg)]">
              <div className="h-full w-[65%] rounded-full bg-[var(--color-brand)]" />
            </div>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{t.resumeLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
