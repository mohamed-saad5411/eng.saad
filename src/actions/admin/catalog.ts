"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/require-admin";

function firstRelation<T>(relation: T | T[] | null | undefined): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation ?? null;
}

export async function setProgramPublished(formData: FormData) {
  const programId = formData.get("program_id");
  const publishedValue = formData.get("is_published");

  if (
    typeof programId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(programId) ||
    (publishedValue !== "true" && publishedValue !== "false")
  ) {
    throw new Error("Invalid program publication request");
  }

  const admin = await requireAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("programs")
    .update({ is_published: publishedValue === "true" })
    .eq("id", programId);

  if (!admin.isSuperAdmin) {
    if (admin.managedSubjectIds.length === 0) {
      throw new Error("Admin has no assigned subjects");
    }
    query = query.in("subject_id", admin.managedSubjectIds);
  }

  const { data, error } = await query.select("id").maybeSingle();
  if (error) throw new Error(`Failed to update program: ${error.message}`);
  if (!data) throw new Error("Program not found or not permitted");

  revalidatePath("/[locale]/admin/academic", "page");
}

export async function setContentPublished(formData: FormData) {
  const contentType = formData.get("content_type");
  const contentId = formData.get("content_id");
  const publishedValue = formData.get("is_published");
  if (
    (contentType !== "unit" && contentType !== "lesson") ||
    typeof contentId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(contentId) ||
    (publishedValue !== "true" && publishedValue !== "false")
  ) {
    throw new Error("Invalid content publication request");
  }

  const admin = await requireAdmin();
  const supabase = await createClient();
  if (!admin.isSuperAdmin) {
    if (admin.managedSubjectIds.length === 0) {
      throw new Error("Admin has no assigned subjects");
    }

    let subjectId: string | null = null;
    if (contentType === "unit") {
      const { data, error } = await supabase
        .from("units")
        .select("terms!inner(programs!inner(subject_id))")
        .eq("id", contentId)
        .maybeSingle();
      if (error) throw new Error(`Failed to verify unit access: ${error.message}`);
      const term = firstRelation(data?.terms);
      subjectId = firstRelation(term?.programs)?.subject_id ?? null;
    } else {
      const { data, error } = await supabase
        .from("lessons")
        .select("units!inner(terms!inner(programs!inner(subject_id)))")
        .eq("id", contentId)
        .maybeSingle();
      if (error) throw new Error(`Failed to verify lesson access: ${error.message}`);
      const unit = firstRelation(data?.units);
      const term = firstRelation(unit?.terms);
      subjectId = firstRelation(term?.programs)?.subject_id ?? null;
    }
    if (!subjectId || !admin.managedSubjectIds.includes(subjectId)) {
      throw new Error("Content not found or not permitted");
    }
  }

  const published = publishedValue === "true";
  const result =
    contentType === "unit"
      ? await supabase.from("units").update({ is_published: published }).eq("id", contentId).select("id").maybeSingle()
      : await supabase.from("lessons").update({ is_published: published }).eq("id", contentId).select("id").maybeSingle();
  if (result.error) throw new Error(`Failed to update content: ${result.error.message}`);
  if (!result.data) throw new Error("Content not found or not permitted");

  revalidatePath("/[locale]/admin/content", "page");
}

export async function setExamPublished(formData: FormData) {
  const examId = formData.get("exam_id");
  const publishedValue = formData.get("is_published");
  if (
    typeof examId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(examId) ||
    (publishedValue !== "true" && publishedValue !== "false")
  ) {
    throw new Error("Invalid exam publication request");
  }

  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .update({ is_published: publishedValue === "true" })
    .eq("id", examId)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(`Failed to update exam: ${error.message}`);
  if (!data) throw new Error("Exam not found or not permitted");

  revalidatePath("/[locale]/admin/exams", "page");
}
