// import bgmath from "../../../../../public/assets/imgs/bgmath.jpg";
// import bgphy from "../../../../../public/assets/imgs/bgphy.jpg";
// import { HowItWorks } from "@/components/landing/how-it-works";
// import { SectionHeading } from "@/components/landing/section-heading";
// import { ProgramCard, type Program } from "@/components/landing/program-card";
// import Link from "next/link";
// import Image from "next/image";

// const copy = {
//   ar: {
//     // label: "البرامج",
//     // title: "اختر برنامجك",
//     // body: "خمس برامج مستقلة تغطي رياضيات، إحصاء، ومحاسبة وإدارة أعمال — بالعربي، الإنجليزي، والألماني.",
//     ctaTitle: "اختر البرنامج المناسب لك",
//     ctaBody: "اختر مادتك و صفك الدراسي وابدأ التعلم اليوم.",
//     ctaButtonmath: "استكشف الرياضيات",
//     ctaButtonphysics: "استكشف الفيزياء",
//   },
//   en: {
//     // label: "Programs",
//     // title: "Choose your program",
//     // body: "Independent programs covering Mathematics, Statistics, and Business & Accounting — in Arabic, English, and German.",
//     ctaTitle: "Choose the right program for you",
//     ctaBody: "Pick your subject and grade and begin learning today.",
//     ctaButtonmath: "Explore math programs",
//     ctaButtonphysics: "Explore physics programs",
//   },
// };

// const programs: Record<"ar" | "en", Program[]> = {
//   ar: [
//     { slug: "math-ar-3", subject: "رياضيات", language: "عربي", grade: "٣ ث", description: "شرح كامل لمنهج الرياضيات، الجبر والتفاضل والتكامل." },
//     { slug: "statistics-ar", subject: "إحصاء", language: "عربي", grade: "٣ ث أدبي", description: "شرح منظم لمنهج الإحصاء لطلبة القسم الأدبي." },
//     { slug: "business-ar", subject: "محاسبة وإدارة أعمال", language: "عربي", grade: "٢ ث", description: "مسار الإدارة والمحاسبة، بإشراف مدرسي الرياضيات." },
//     { slug: "math-de", subject: "Mathematik", language: "ألماني", grade: "١-٣ ث", description: "شرح الرياضيات بالمنهج والمصطلحات الألمانية." },
//   ],
//   en: [
//     { slug: "math-en-3", subject: "Mathematics", language: "English", grade: "3rd Sec", description: "Full coverage of algebra, differentiation, and integration." },
//     { slug: "statistics-en", subject: "Statistics", language: "English", grade: "3rd Sec · Literary", description: "Structured statistics content for literary-track students." },
//     { slug: "business-en", subject: "Business & Accounting", language: "English", grade: "2nd Sec", description: "Business & Accounting track, taught by math faculty." },
//     { slug: "math-de-en", subject: "Mathematik", language: "German", grade: "1-3 Sec", description: "Mathematics with German curriculum and terminology." },
//   ],
// };

// export default async function HomePage({ params }: { params: Promise<{ locale: "ar" | "en" }> }) {
//   const { locale } = await params;
//   const t = copy[locale];

//   return (
//     <>
//       <section className="container-page py-20">
//         <div className="rounded-3xl bg-[var(--color-ink)] px-8 py-16 text-center text-white">
//           <h2 className="text-3xl font-bold md:text-4xl">{t.ctaTitle}</h2>
//           <p className="mx-auto mt-3 max-w-md text-white/80">{t.ctaBody}</p>
//           <div className="flex w-[70%] justify-center gap-8 m-auto items-center">
//             <Link
//               href="/programs/math"
//               className="mt-8 inline-block rounded-xl w-full bg-white overflow-hidden shadow-lg font-semibold text-[var(--color-ink)]"
//             >
//               <Image width={300} height={400} className="w-full min-h-60 mb- hover:scale-103 transition-all duration-300" src={bgmath} alt="math" />
//               <span className=" flex h-[100] items-center justify-center">{t.ctaButtonmath}</span>
//             </Link>
//             <Link
//               href="/programs/physics"
//               className="mt-8 inline-block rounded-xl w-full bg-white overflow-hidden shadow-lg font-semibold text-[var(--color-ink)]"
//             >
//               <Image width={300} height={400} className="w-full min-h-60 hover:scale-103 transition-all duration-300" src={bgphy} alt="physics" />
//               <span className=" flex h-[100] items-center justify-center">{t.ctaButtonphysics}</span>
//             </Link>

//           </div>
//         </div>
//       </section>
//     </>
//   );
// }


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

export default async function ProgramsPage({ params }: { params: Promise<{ locale: "ar" | "en" }> }) {
  const { locale } = await params;
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