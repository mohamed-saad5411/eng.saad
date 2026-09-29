import { createClient } from "@/lib/supabase/server";

type Locale = "ar" | "en";

export type ProgramCardData = {
  slug: string;
  subjectSlug: "math" | "physics";
  subject: string;
  curriculum?: string;        // display label (track name), only when a track applies
  language: string;           // display label
  grade: string;               // display label
  description: string;
  // raw codes — for the browser's tab/grade/track logic, not for display
  curriculumCode: string;      // 'thanaweya_legacy' | 'baccalaureate' | 'german_future'
  gradeLevel: number;
  trackCode: string | null;    // 'science' | 'math_science' | 'literary' | 'business_admin' | null
  languageCode: string;        // 'ar' | 'en' | 'de'
};

const LANG_LABEL: Record<string, Record<Locale, string>> = {
  ar: { ar: "عربي", en: "Arabic" },
  en: { ar: "إنجليزي", en: "English" },
  de: { ar: "ألماني", en: "German" },
};

export async function listProgramsForGroup(
  group: "math" | "physics",
  locale: Locale
): Promise<ProgramCardData[]> {
  const supabase = await createClient();

  // Resolve subject ids for this group FIRST, against the subjects table
  // directly — filtering an embedded relation with neq is unreliable in
  // PostgREST, so we avoid it entirely.
  const { data: subjectRows } = await supabase.from("subjects").select("id, slug, name_ar, name_en");
  const relevantSubjects = (subjectRows ?? []).filter((s) =>
    group === "physics" ? s.slug === "physics" : s.slug !== "physics"
  );
  const subjectIds = relevantSubjects.map((s) => s.id);
  if (subjectIds.length === 0) return [];

  const subjectById = new Map(relevantSubjects.map((s) => [s.id, s]));

  const { data, error } = await supabase
    .from("programs")
    .select(
      `
      slug, title, description, subject_id,
      curriculums ( code ),
      languages ( code ),
      grades ( name, level_order ),
      tracks ( code, name_ar, name_en )
    `
    )
    .in("subject_id", subjectIds)
    .eq("is_published", true);

  if (error) {
    console.error("listProgramsForGroup error:", error);
    return [];
  }
  if (!data) return [];

  return data.map((row: any) => {
    const subj = subjectById.get(row.subject_id)!;
    return {
      slug: row.slug,
      subjectSlug: group,
      subject: locale === "ar" ? subj.name_ar : subj.name_en,
      curriculum: row.tracks ? (locale === "ar" ? row.tracks.name_ar : row.tracks.name_en) : undefined,
      language: LANG_LABEL[row.languages.code]?.[locale] ?? row.languages.code,
      grade: row.grades.name,
      description: row.description ?? "",
      curriculumCode: row.curriculums.code,
      gradeLevel: row.grades.level_order,
      trackCode: row.tracks?.code ?? null,
      languageCode: row.languages.code,
    };
  });
}

// ... getProgramWithTerms / getTermUnits / getUnitLessons unchanged — keep
// them exactly as in the previous services-programs.ts file.

export type TermSummary = { slug: string; name: string; unitsCount: number };
export type ProgramWithTerms = { title: string; grade: string; terms: TermSummary[] };

export async function getProgramWithTerms(programSlug: string): Promise<ProgramWithTerms | null> {
  const supabase = await createClient();

  const { data: program } = await supabase
    .from("programs")
    .select("id, title, grades ( name )")
    .eq("slug", programSlug)
    .single();

  if (!program) return null;

  const { data: terms } = await supabase
    .from("terms")
    .select("slug, name, units ( id )")
    .eq("program_id", (program as any).id)
    .order("sort_order");

  return {
    title: program.title,
    grade: (program as any).grades.name,
    terms: (terms ?? []).map((t: any) => ({
      slug: t.slug,
      name: t.name,
      unitsCount: t.units?.length ?? 0,
    })),
  };
}

export type UnitSummary = { slug: string; title: string; lessonsCount: number };
export type TermWithUnits = { termName: string; units: UnitSummary[] };

export async function getTermUnits(programSlug: string, termSlug: string): Promise<TermWithUnits | null> {
  const supabase = await createClient();

  const { data: term } = await supabase
    .from("terms")
    .select("id, name, programs!inner ( slug )")
    .eq("slug", termSlug)
    .eq("programs.slug", programSlug)
    .single();

  if (!term) return null;

  const { data: units } = await supabase
    .from("units")
    .select("slug, title, lessons ( id )")
    .eq("term_id", (term as any).id)
    .eq("is_published", true)
    .order("sort_order");

  return {
    termName: (term as any).name,
    units: (units ?? []).map((u: any) => ({
      slug: u.slug,
      title: u.title,
      lessonsCount: u.lessons?.length ?? 0,
    })),
  };
}

export type LessonSummary = { slug: string; title: string };
export type UnitWithLessons = { unitTitle: string; lessons: LessonSummary[] };

export async function getUnitLessons(
  programSlug: string,
  termSlug: string,
  unitSlug: string
): Promise<UnitWithLessons | null> {
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("units")
    .select("id, title, terms!inner ( slug, programs!inner ( slug ) )")
    .eq("slug", unitSlug)
    .eq("terms.slug", termSlug)
    .eq("terms.programs.slug", programSlug)
    .single();

  if (!unit) return null;

  const { data: lessons } = await supabase
    .from("lessons")
    .select("slug, title")
    .eq("unit_id", (unit as any).id)
    .eq("is_published", true)
    .order("sort_order");

  return {
    unitTitle: (unit as any).title,
    lessons: lessons ?? [],
  };
}