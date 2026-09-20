// import Link from "next/link";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// export type Program = {
//   slug: string;
//   subject: string;
//   language: string;
//   grade: string;
//   description: string;
// };

// export function ProgramCard({ program, locale }: { program: Program; locale: "ar" | "en" }) {
//   const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
//   const exploreLabel = locale === "ar" ? "استكشف المحتوى" : "Explore content";

//   return (
//     <Link
//       href={`/programs/${program.slug}`}
//       className="group flex min-h-[240px] flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-white p-7 transition-transform hover:-translate-y-1 hover:shadow-md"
//     >
//       <div>
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-[var(--color-muted)]">{program.language}</span>
//           <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
//             {program.grade}
//           </span>
//         </div>
//         <h3 className="mt-3 text-2xl font-bold">{program.subject}</h3>
//         <p className="mt-3 leading-7 text-[var(--color-muted)]">{program.description}</p>
//       </div>

//       <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
//         {exploreLabel}
//         <Arrow size={16} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
//       </div>
//     </Link>
//   );
// }


import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type Program = {
  slug: string;
  subjectSlug: "math" | "physics"; // NEW — needed to build the nested route
  subject: string;
  curriculum?: string;   // only meaningful for subjects with more than one curriculum (Physics)
  language: string;
  grade: string;
  description: string;
};

export function ProgramCard({ program, locale }: { program: Program; locale: "ar" | "en" }) {
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const exploreLabel = locale === "ar" ? "استكشف المحتوى" : "Explore content";

  return (
    <Link
      href={`/programs/${program.subjectSlug}/${program.slug}`}
      className="group flex min-h-[240px] flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-white p-7 transition-transform hover:-translate-y-1 hover:shadow-md"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-[var(--color-muted)]">{program.language}</span>
          <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
            {program.grade}
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-bold">{program.subject}</h3>
        {program.curriculum && (
          <span className="mt-1 inline-block text-xs font-semibold text-[var(--color-brand)]">
            {program.curriculum}
          </span>
        )}
        <p className="mt-3 leading-7 text-[var(--color-muted)]">{program.description}</p>
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
        {exploreLabel}
        <Arrow size={16} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}