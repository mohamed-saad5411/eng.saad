// "use client";

// import { useState } from "react";
// import { ProgramCard, type Program } from "@/components/landing/program-card";
// import type { ProgramCardData } from "@/services/programs";

// type Locale = "ar" | "en";

// const copy = {
//     ar: {
//         legacy: "ثانوية عامة (نظام قديم)",
//         bacc: "بكالوريا",
//         chooseGrade: "اختر الصف",
//         chooseTrack: "اختر التخصص",
//         grades: { 1: "١ث", 2: "٢ث", 3: "٣ث" } as Record<number, string>,
//     },
//     en: {
//         legacy: "Legacy Thanaweya Amma",
//         bacc: "Baccalaureate",
//         chooseGrade: "Choose your grade",
//         chooseTrack: "Choose your track",
//         grades: { 1: "1st Sec", 2: "2nd Sec", 3: "3rd Sec" } as Record<number, string>,
//     },
// };

// export function ProgramBrowser({ programs, locale }: { programs: ProgramCardData[]; locale: Locale }) {
//     const t = copy[locale];
//     const [curriculum, setCurriculum] = useState<"thanaweya_legacy" | "baccalaureate">("baccalaureate");
//     const [grade, setGrade] = useState<number | null>(null);
//     const [track, setTrack] = useState<string | null>(null);

//     const inCurriculum = programs.filter((p) => p.curriculumCode === curriculum);

//     // reset downstream selections whenever the tab changes
//     function switchCurriculum(c: typeof curriculum) {
//         setCurriculum(c);
//         setGrade(null);
//         setTrack(null);
//     }

//     const gradesAvailable = curriculum === "baccalaureate"
//         ? [...new Set(inCurriculum.map((p) => p.gradeLevel))].sort()
//         : [];

//     const tracksForGrade = grade
//         ? [...new Map(
//             inCurriculum
//                 .filter((p) => p.gradeLevel === grade && p.trackCode)
//                 .map((p) => [p.trackCode, p.curriculum!])
//         ).entries()]
//         : [];

//     // final set of program cards to show
//     let visiblePrograms: ProgramCardData[] = [];
//     if (curriculum === "thanaweya_legacy") {
//         visiblePrograms = inCurriculum;
//     } else if (grade === 1) {
//         visiblePrograms = inCurriculum.filter((p) => p.gradeLevel === 1);
//     } else if (grade && track) {
//         visiblePrograms = inCurriculum.filter((p) => p.gradeLevel === grade && p.trackCode === track);
//     }

//     return (
//         <div>
//             {/* Tabs: legacy vs baccalaureate */}
//             <div className="flex gap-2 border-b border-[var(--color-border)]">
//                 {(["thanaweya_legacy", "baccalaureate"] as const).map((c) => (
//                     <button
//                         key={c}
//                         onClick={() => switchCurriculum(c)}
//                         className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${curriculum === c
//                                 ? "border-[var(--color-brand)] text-[var(--color-ink)]"
//                                 : "border-transparent text-[var(--color-muted)]"
//                             }`}
//                     >
//                         {c === "thanaweya_legacy" ? t.legacy : t.bacc}
//                     </button>
//                 ))}
//             </div>

//             {/* Step: grade (baccalaureate only) */}
//             {curriculum === "baccalaureate" && grade === null && (
//                 <div className="mt-10">
//                     <h2 className="text-lg font-bold">{t.chooseGrade}</h2>
//                     <div className="mt-4 flex flex-wrap gap-3">
//                         {gradesAvailable.map((g) => (
//                             <button
//                                 key={g}
//                                 onClick={() => setGrade(g)}
//                                 className="rounded-xl border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold hover:border-[var(--color-brand)]"
//                             >
//                                 {t.grades[g]}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Step: track (grades 2 & 3 only) */}
//             {curriculum === "baccalaureate" && grade && grade !== 1 && track === null && (
//                 <div className="mt-10">
//                     <button onClick={() => setGrade(null)} className="text-sm text-[var(--color-muted)] mb-4">
//                         ← {t.grades[grade]}
//                     </button>
//                     <h2 className="text-lg font-bold">{t.chooseTrack}</h2>
//                     <div className="mt-4 grid gap-3 sm:grid-cols-3">
//                         {tracksForGrade.map(([code, name]) => (
//                             <button
//                                 key={code}
//                                 onClick={() => setTrack(code)}
//                                 className="rounded-xl border border-[var(--color-border)] bg-white px-6 py-4 text-start text-sm font-semibold hover:border-[var(--color-brand)]"
//                             >
//                                 {name}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Final: the actual program card(s) — one per language */}
//             {visiblePrograms.length > 0 && (
//                 <div className="mt-10">
//                     {(grade === 2 || grade === 3) && (
//                         <button onClick={() => setTrack(null)} className="text-sm text-[var(--color-muted)] mb-4 block">
//                             ← {t.chooseTrack}
//                         </button>
//                     )}
//                     <div className="grid gap-6 sm:grid-cols-3">
//                         {visiblePrograms.map((p) => (
//                             <ProgramCard key={p.slug} program={p as Program} locale={locale} />
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ProgramCard, type Program } from "@/components/landing/program-card";
import type { ProgramCardData } from "@/services/programs";

type Locale = "ar" | "en";

const copy = {
  ar: {
    legacy: "ثانوية عامة (نظام قديم)",
    bacc: "بكالوريا",
    chooseGrade: "اختر الصف",
    chooseTrack: "اختر التخصص",
    grades: { 1: "١ث", 2: "٢ث", 3: "٣ث" } as Record<number, string>,
  },
  en: {
    legacy: "Legacy Thanaweya Amma",
    bacc: "Baccalaureate",
    chooseGrade: "Choose your grade",
    chooseTrack: "Choose your track",
    grades: { 1: "1st Sec", 2: "2nd Sec", 3: "3rd Sec" } as Record<number, string>,
  },
};

export function ProgramBrowser({ programs, locale }: { programs: ProgramCardData[]; locale: Locale }) {
  const t = copy[locale];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // state now lives ENTIRELY in the URL — nothing kept in React state —
  // so browser Back/Forward restores it automatically, and the page is
  // bookmarkable/shareable at any step.
  const curriculum = (searchParams.get("curriculum") as "thanaweya_legacy" | "baccalaureate") || "baccalaureate";
  const gradeParam = searchParams.get("grade");
  const grade = gradeParam ? Number(gradeParam) : null;
  const track = searchParams.get("track");

  function pushParams(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    // push (not replace) — every step (tab, grade, track) gets its OWN
    // history entry, so Back steps through them one at a time: track →
    // grade → tab → whatever page you were on before /programs/math.
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function switchCurriculum(c: "thanaweya_legacy" | "baccalaureate") {
    pushParams({ curriculum: c, grade: null, track: null });
  }
  function selectGrade(g: number) {
    pushParams({ grade: String(g), track: null });
  }
  function selectTrack(code: string) {
    pushParams({ track: code });
  }

  const inCurriculum = programs.filter((p) => p.curriculumCode === curriculum);

  const gradesAvailable = curriculum === "baccalaureate"
    ? [...new Set(inCurriculum.map((p) => p.gradeLevel))].sort()
    : [];

  const tracksForGrade = grade
    ? [...new Map(
        inCurriculum
          .filter((p) => p.gradeLevel === grade && p.trackCode)
          .map((p) => [p.trackCode, p.curriculum!])
      ).entries()]
    : [];

  let visiblePrograms: ProgramCardData[] = [];
  if (curriculum === "thanaweya_legacy") {
    visiblePrograms = inCurriculum;
  } else if (grade === 1) {
    visiblePrograms = inCurriculum.filter((p) => p.gradeLevel === 1);
  } else if (grade && track) {
    visiblePrograms = inCurriculum.filter((p) => p.gradeLevel === grade && p.trackCode === track);
  }

  return (
    <div>
      <div className="flex gap-2 border-b border-[var(--color-border)]">
        {(["thanaweya_legacy", "baccalaureate"] as const).map((c) => (
          <button
            key={c}
            onClick={() => switchCurriculum(c)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              curriculum === c
                ? "border-[var(--color-brand)] text-[var(--color-ink)]"
                : "border-transparent text-[var(--color-muted)]"
            }`}
          >
            {c === "thanaweya_legacy" ? t.legacy : t.bacc}
          </button>
        ))}
      </div>

      {curriculum === "baccalaureate" && grade === null && (
        <div className="mt-10">
          <h2 className="text-lg font-bold">{t.chooseGrade}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {gradesAvailable.map((g) => (
              <button
                key={g}
                onClick={() => selectGrade(g)}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-3 text-sm font-semibold hover:border-[var(--color-brand)]"
              >
                {t.grades[g]}
              </button>
            ))}
          </div>
        </div>
      )}

      {curriculum === "baccalaureate" && grade && grade !== 1 && track === null && (
        <div className="mt-10">
          <button onClick={() => router.back()} className="text-sm text-[var(--color-muted)] mb-4">
            ← {t.grades[grade]}
          </button>
          <h2 className="text-lg font-bold">{t.chooseTrack}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tracksForGrade.map(([code, name]) => (
              <button
                key={code}
                onClick={() => selectTrack(code as string)}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-4 text-start text-sm font-semibold hover:border-[var(--color-brand)]"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {visiblePrograms.length > 0 && (
        <div className="mt-10">
          {(grade === 2 || grade === 3) && (
            <button onClick={() => router.back()} className="text-sm text-[var(--color-muted)] mb-4 block">
              ← {t.chooseTrack}
            </button>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            {visiblePrograms.map((p) => (
              <ProgramCard key={p.slug} program={p as Program} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}