import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SectionHeading } from "@/components/landing/section-heading";
import { ProgramCard, type Program } from "@/components/landing/program-card";
import Link from "next/link";

const copy = {
  ar: {
    label: "البرامج",
    title: "اختر برنامجك",
    body: "برامج مستقلة تغطي رياضيات، إحصاء، محاسبة وإدارة أعمال، وفيزياء — بالعربي، الإنجليزي، والألماني.",
    ctaTitle: "جاهز تبدأ؟",
    ctaBody: "اختر صفك الدراسي وابدأ التعلم اليوم.",
    ctaButton: "استكشف البرامج",
  },
  en: {
    label: "Programs",
    title: "Choose your program",
    body: "Independent programs covering Mathematics, Statistics, Business & Accounting, and Physics — in Arabic, English, and German.",
    ctaTitle: "Ready to start?",
    ctaBody: "Pick your grade and begin learning today.",
    ctaButton: "Explore programs",
  },
};

const programs: Record<"ar" | "en", Program[]> = {
  ar: [
    { slug: "math-ar-3", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "٣ ث", description: "شرح كامل لمنهج الرياضيات، الجبر والتفاضل والتكامل." },
    { slug: "statistics-ar", subjectSlug: "math", subject: "إحصاء", language: "عربي", grade: "٣ ث أدبي", description: "شرح منظم لمنهج الإحصاء لطلبة القسم الأدبي." },
    { slug: "business-ar", subjectSlug: "math", subject: "محاسبة وإدارة أعمال", language: "عربي", grade: "٢ ث", description: "مسار الإدارة والمحاسبة، بإشراف مدرسي الرياضيات." },
    { slug: "physics-national", subjectSlug: "physics", subject: "Physics", curriculum: "National", language: "إنجليزي", grade: "١-٣ ث", description: "منهج National بالسكشن الإنجليزي." },
  ],
  en: [
    { slug: "math-en-3", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "3rd Sec", description: "Full coverage of algebra, differentiation, and integration." },
    { slug: "statistics-en", subjectSlug: "math", subject: "Statistics", language: "English", grade: "3rd Sec · Literary", description: "Structured statistics content for literary-track students." },
    { slug: "business-en", subjectSlug: "math", subject: "Business & Accounting", language: "English", grade: "2nd Sec", description: "Business & Accounting track, taught by math faculty." },
    { slug: "physics-national", subjectSlug: "physics", subject: "Physics", curriculum: "National", language: "English", grade: "1-3 Sec", description: "Egyptian National system, English section." },
  ],
};

export default async function HomePage({ params }: { params: Promise<{ locale: "ar" | "en" }> }) {
  const { locale } = await params;
  const t = copy[locale];

  return (
    <>
      <Hero locale={locale} />

      <section className="container-page py-20">
        <SectionHeading label={t.label} title={t.title} body={t.body} align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {programs[locale].map((p) => (
            <ProgramCard key={p.slug} program={p} locale={locale} />
          ))}
        </div>
      </section>

      <HowItWorks locale={locale} />

      <section className="container-page pb-24">
        <div className="rounded-3xl bg-[var(--color-ink)] px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">{t.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">{t.ctaBody}</p>
          <Link
            href="/programs"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-4 text-sm font-semibold text-[var(--color-ink)]"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}