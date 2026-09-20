import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/landing/section-heading";
import { ProgramCard, type Program } from "@/components/landing/program-card";

type SubjectSlug = "math" | "physics";

const copy = {
  ar: {
    math: { title: "برامج الرياضيات", body: "كل برامج الرياضيات والمواد المرتبطة بيها، بلغاتها المختلفة." },
    physics: { title: "برامج الفيزياء", body: "اختر البرنامج حسب النظام التعليمي بتاعك." },
  },
  en: {
    math: { title: "Mathematics programs", body: "All math-family programs, across every content language." },
    physics: { title: "Physics programs", body: "Choose the program that matches your curriculum." },
  },
};

// Placeholder data — will move to services/programs once Supabase schema is live.
const dataBySubject: Record<SubjectSlug, Record<"ar" | "en", Program[]>> = {
  math: {
    ar: [
      { slug: "math-ar-1", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "١ ث", description: "أساسيات الجبر والهندسة." },
      { slug: "math-ar-2", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "٢ ث", description: "تعميق المفاهيم الجبرية والتحليلية." },
      { slug: "math-ar-3", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "٣ ث", description: "التفاضل والتكامل، استعداد كامل للثانوية العامة." },
      { slug: "statistics-ar", subjectSlug: "math", subject: "إحصاء", language: "عربي", grade: "٣ ث أدبي", description: "شرح منظم لمنهج الإحصاء لطلبة القسم الأدبي." },
      { slug: "business-ar", subjectSlug: "math", subject: "محاسبة وإدارة أعمال", language: "عربي", grade: "٢ ث", description: "مسار الإدارة والمحاسبة." },
      { slug: "math-de", subjectSlug: "math", subject: "Mathematik", language: "ألماني", grade: "١-٣ ث", description: "شرح الرياضيات بالمنهج الألماني." },
    ],
    en: [
      { slug: "math-en-1", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "1st Sec", description: "Algebra and geometry foundations." },
      { slug: "math-en-2", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "2nd Sec", description: "Deeper algebraic and analytic concepts." },
      { slug: "math-en-3", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "3rd Sec", description: "Differentiation, integration, full exam prep." },
      { slug: "statistics-en", subjectSlug: "math", subject: "Statistics", language: "English", grade: "3rd Sec · Literary", description: "Structured statistics for literary-track students." },
      { slug: "business-en", subjectSlug: "math", subject: "Business & Accounting", language: "English", grade: "2nd Sec", description: "Business & Accounting Management track." },
    ],
  },
  physics: {
    ar: [
      { slug: "physics-national", subjectSlug: "physics", subject: "Physics", curriculum: "National", language: "إنجليزي", grade: "١-٣ ث", description: "منهج National بالسكشن الإنجليزي." },
      { slug: "physics-igcse", subjectSlug: "physics", subject: "Physics", curriculum: "IGCSE", language: "إنجليزي", grade: "Year 10-12", description: "منهج IGCSE — Physics." },
      { slug: "physics-american", subjectSlug: "physics", subject: "Physics", curriculum: "American", language: "إنجليزي", grade: "Grade 9-12", description: "منهج الدبلومة الأمريكية." },
    ],
    en: [
      { slug: "physics-national", subjectSlug: "physics", subject: "Physics", curriculum: "National", language: "English", grade: "1st-3rd Sec", description: "Egyptian National system, English section." },
      { slug: "physics-igcse", subjectSlug: "physics", subject: "Physics", curriculum: "IGCSE", language: "English", grade: "Year 10-12", description: "IGCSE Physics syllabus." },
      { slug: "physics-american", subjectSlug: "physics", subject: "Physics", curriculum: "American", language: "English", grade: "Grade 9-12", description: "American diploma curriculum." },
    ],
  },
};

export default async function SubjectProgramsPage({
  params,
}: {
  params:  Promise<{ locale: string, subject: string }>;
}) {
  const { locale: rawLocale, subject } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as "ar" | "en";

  if (subject !== "math" && subject !== "physics") {
    notFound();
  }

  const t = copy[locale][subject as SubjectSlug];
  const programs = dataBySubject[subject as SubjectSlug][locale];

  return (
    <section className="container-page py-20">
      <SectionHeading title={t.title} body={t.body} />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <ProgramCard key={p.slug} program={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}