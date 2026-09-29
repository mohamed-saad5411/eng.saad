// import { notFound } from "next/navigation";
// import { SectionHeading } from "@/components/landing/section-heading";
// import { ProgramCard, type Program } from "@/components/landing/program-card";

// type SubjectSlug = "math" | "physics";

// const copy = {
//   ar: {
//     math: { title: "برامج الرياضيات", body: "كل برامج الرياضيات والمواد المرتبطة بيها، بلغاتها المختلفة." },
//     physics: { title: "برامج الفيزياء", body: "اختر البرنامج حسب النظام التعليمي بتاعك." },
//   },
//   en: {
//     math: { title: "Mathematics programs", body: "All math-family programs, across every content language." },
//     physics: { title: "Physics programs", body: "Choose the program that matches your curriculum." },
//   },
// };

// const educationalSections = {
//   ar: {
//     first: "اولا:",
//     mathSenior: "الرياضيات للمرحلة الثانوية",
//     second: "ثانيا:",
//     statisticSenior: "الاحصاء للمرحلة الثانوية",
//     third: "ثالثا:",
//     accounting: "المحاسبة وإدارة الأعمال للمرحلة الثانوية",
//     fourth: "رابعا:",
//     dauetschMath: "رياضيات باللغة الألمانية",
//     fifth: "خامسا:",
//     american: "رياضيات بالمنهج الأمريكي",
//     sixth: "سادسا:",
//     IGCE: "رياضيات IGCE",
//   },
//   en: {
//     first: "First:",
//     mathSenior: "Mathematics for Secondary Stage",
//     second: "Second:",
//     statisticSenior: "Statistics for Secondary Stage",
//     third: "Third:",
//     accounting: "Accounting & Business Management for Secondary Stage",
//     fourth: "Fourth:",
//     dauetschMath: "Mathematik auf Deutsch",
//     fifth: "Fifth:",
//     american: "Mathematics in American Curriculum",
//     sixth: "Sixth:",
//     IGCE: "IGCE Mathematics",
//   },
// };


// // Placeholder data — will move to services/programs once Supabase schema is live.
// const dataBySubject: Record<SubjectSlug, Record<"ar" | "en", Program[]>> = {
//   math: {
//     ar: [
//       { slug: "math-ar-1", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "١ ث", description: "أساسيات الجبر والهندسة." },
//       { slug: "math-ar-2", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "٢ ث", description: "تعميق المفاهيم الجبرية والتحليلية." },
//       { slug: "math-ar-3", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "٣ ث", description: "التفاضل والتكامل، استعداد كامل للثانوية العامة." },
//       { slug: "math-en-1", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "1st Sec", description: "Algebra and geometry foundations." },
//       { slug: "math-en-2", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "2nd Sec", description: "Deeper algebraic and analytic concepts." },
//       { slug: "math-en-3", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "3rd Sec", description: "Differentiation, integration, full exam prep." },

//       { slug: "statistics-ar", subjectSlug: "math", subject: "إحصاء", language: "عربي", grade: "٣ ث أدبي", description: "شرح منظم لمنهج الإحصاء لطلبة القسم الأدبي." },
//       { slug: "statistics-en", subjectSlug: "math", subject: "Statistics", language: "English", grade: "3rd Sec · Literary", description: "Structured statistics for literary-track students." },

//       { slug: "business-ar", subjectSlug: "math", subject: "محاسبة وإدارة أعمال", language: "عربي", grade: "٢ ث", description: "مسار الإدارة والمحاسبة." },
//       { slug: "business-en", subjectSlug: "math", subject: "Business & Accounting", language: "English", grade: "2nd Sec", description: "Business & Accounting Management track." },

//       { slug: "math-de-ar-1", subjectSlug: "math", subject: "Mathematik", language: "German", grade: "1st Sec", description: "شرح الرياضيات بالمنهج الألماني." },
//       { slug: "math-de-ar-2", subjectSlug: "math", subject: "Mathematik", language: "German", grade: "2nd Sec", description: "شرح الرياضيات بالمنهج الألماني." },
//       { slug: "math-de-ar-3", subjectSlug: "math", subject: "Mathematik", language: "German", grade: "3rd Sec", description: "شرح الرياضيات بالمنهج الألماني." },



//     ],
//     en: [
//       { slug: "math-ar-1", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "١ ث", description: "أساسيات الجبر والهندسة." },
//       { slug: "math-ar-2", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "٢ ث", description: "تعميق المفاهيم الجبرية والتحليلية." },
//       { slug: "math-ar-3", subjectSlug: "math", subject: "رياضيات", language: "عربي", grade: "٣ ث", description: "التفاضل والتكامل، استعداد كامل للثانوية العامة." },
//       { slug: "math-en-1", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "1st Sec", description: "Algebra and geometry foundations." },
//       { slug: "math-en-2", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "2nd Sec", description: "Deeper algebraic and analytic concepts." },
//       { slug: "math-en-3", subjectSlug: "math", subject: "Mathematics", language: "English", grade: "3rd Sec", description: "Differentiation, integration, full exam prep." },

//       { slug: "statistics-ar", subjectSlug: "math", subject: "إحصاء", language: "عربي", grade: "٣ ث أدبي", description: "شرح منظم لمنهج الإحصاء لطلبة القسم الأدبي." },
//       { slug: "statistics-en", subjectSlug: "math", subject: "Statistics", language: "English", grade: "3rd Sec · Literary", description: "Structured statistics for literary-track students." },

//       { slug: "business-ar", subjectSlug: "math", subject: "محاسبة وإدارة أعمال", language: "عربي", grade: "٢ ث", description: "مسار الإدارة والمحاسبة." },
//       { slug: "business-en", subjectSlug: "math", subject: "Business & Accounting", language: "English", grade: "2nd Sec", description: "Business & Accounting Management track." },

//       { slug: "math-de-en-1", subjectSlug: "math", subject: "Mathematik", language: "German", grade: "1st Sec", description: "شرح الرياضيات بالمنهج الألماني." },
//       { slug: "math-de-en-2", subjectSlug: "math", subject: "Mathematik", language: "German", grade: "2nd Sec", description: "شرح الرياضيات بالمنهج الألماني." },
//       { slug: "math-de-en-3", subjectSlug: "math", subject: "Mathematik", language: "German", grade: "3rd Sec", description: "شرح الرياضيات بالمنهج الألماني." },
//     ],
//   },
//   physics: {
//     ar: [
//       { slug: "physics-national", subjectSlug: "physics", subject: "Physics", curriculum: "National", language: "إنجليزي", grade: "١-٣ ث", description: "منهج National بالسكشن الإنجليزي." },
//       { slug: "physics-igcse", subjectSlug: "physics", subject: "Physics", curriculum: "IGCSE", language: "إنجليزي", grade: "Year 10-12", description: "منهج IGCSE — Physics." },
//       { slug: "physics-american", subjectSlug: "physics", subject: "Physics", curriculum: "American", language: "إنجليزي", grade: "Grade 9-12", description: "منهج الدبلومة الأمريكية." },
//     ],
//     en: [
//       { slug: "physics-national", subjectSlug: "physics", subject: "Physics", curriculum: "National", language: "English", grade: "1st-3rd Sec", description: "Egyptian National system, English section." },
//       { slug: "physics-igcse", subjectSlug: "physics", subject: "Physics", curriculum: "IGCSE", language: "English", grade: "Year 10-12", description: "IGCSE Physics syllabus." },
//       { slug: "physics-american", subjectSlug: "physics", subject: "Physics", curriculum: "American", language: "English", grade: "Grade 9-12", description: "American diploma curriculum." },
//     ],
//   },
// };

// export default async function SubjectProgramsPage({
//   params,
// }: {
//   params: Promise<{ locale: string, subject: string }>;
// }) {
//   const { locale: rawLocale, subject } = await params;
//   const locale = (rawLocale === "en" ? "en" : "ar") as "ar" | "en";

//   if (subject !== "math" && subject !== "physics") {
//     notFound();
//   }

//   const t = copy[locale][subject as SubjectSlug];
//   const tr = educationalSections[locale];
//   const programs = dataBySubject[subject as SubjectSlug][locale];

//   return (
//     <section className="container-page py-20">
//       <SectionHeading title={t.title} body={t.body} />


//       {/* ========== first ========== */}
//       <div className="mt-20 bg-sky-500/7 rounded-lg shadow-md py-5 px-4">
//         <SectionHeading label={tr.first} title={tr.mathSenior} />
//       </div>
//       <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {programs.slice(0, 6).map((p) => (
//           <ProgramCard key={p.slug} program={p} locale={locale} />
//         ))}
//       </div>

//       {/* ========== second ========== */}
//       <div className="mt-20 bg-sky-500/7 rounded-lg shadow-md py-5 px-4">
//         <SectionHeading label={tr.second} title={tr.statisticSenior} />
//       </div>
//       <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {programs.slice(6, 8).map((p) => (
//           <ProgramCard key={p.slug} program={p} locale={locale} />
//         ))}
//       </div>

//       {/* ========== third ========== */}
//       <div className="mt-20 bg-sky-500/7 rounded-lg shadow-md py-5 px-4">
//         <SectionHeading label={tr.third} title={tr.accounting} />
//       </div>
//       <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {programs.slice(8, 10).map((p) => (
//           <ProgramCard key={p.slug} program={p} locale={locale} />
//         ))}
//       </div>

//       {/* ========== fourth ========== */}
//       <div className="mt-20 bg-sky-500/7 rounded-lg shadow-md py-5 px-4">
//         <SectionHeading label={tr.fourth} title={tr.dauetschMath} />
//       </div>
//       <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {programs.slice(10, 13).map((p) => (
//           <ProgramCard key={p.slug} program={p} locale={locale} />
//         ))}
//       </div>

//       {/* ========== fifth ========== */}
//       <div className="mt-20 bg-sky-500/7 rounded-lg shadow-md py-5 px-4">
//         <SectionHeading label={tr.fifth} title={tr.american} />
//       </div>
//       <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {programs.slice(13, 16).map((p) => (
//           <ProgramCard key={p.slug} program={p} locale={locale} />
//         ))}
//       </div>

//       {/* ========== sixth ========== */}
//       <div className="mt-20 bg-sky-500/7 rounded-lg shadow-md py-5 px-4">
//         <SectionHeading label={tr.sixth} title={tr.IGCE} />
//       </div>
//       <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {programs.slice(16, 19).map((p) => (
//           <ProgramCard key={p.slug} program={p} locale={locale} />
//         ))}
//       </div>

//     </section>
//   );
// }


import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/landing/section-heading";
import { ProgramCard } from "@/components/landing/program-card";
import { ProgramBrowser } from "@/components/landing/program-browser";
import { listProgramsForGroup } from "@/services/programs";

type SubjectSlug = "math" | "physics";

const copy = {
  ar: {
    math: { title: "برامج الرياضيات", body: "اختر نظامك التعليمي، وبعدين صفك وتخصصك." },
    physics: { title: "برامج الفيزياء", body: "اختر البرنامج حسب النظام التعليمي بتاعك." },
  },
  en: {
    math: { title: "Mathematics programs", body: "Choose your education system, then your grade and track." },
    physics: { title: "Physics programs", body: "Choose the program that matches your curriculum." },
  },
};

export default async function SubjectProgramsPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; subject: string }>;
}) {
  const { locale, subject } = await params;

  if (subject !== "math" && subject !== "physics") notFound();

  const t = copy[locale][subject as SubjectSlug];
  const programs = await listProgramsForGroup(subject as SubjectSlug, locale);

  return (
    <section className="container-page py-20">
      <SectionHeading title={t.title} body={t.body} />

      {programs.length === 0 ? (
        <p className="mt-12 text-[var(--color-muted)]">
          {locale === "ar" ? "لا يوجد برامج منشورة حاليًا." : "No published programs yet."}
        </p>
      ) : subject === "math" ? (
        <div className="mt-12">
          <ProgramBrowser programs={programs} locale={locale} />
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <ProgramCard key={p.slug} program={p} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}