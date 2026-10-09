"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";

export async function postAnnouncementAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const subjectId = formData.get("subject_id") as string;
  const titleAr = formData.get("title_ar") as string;
  const bodyAr = formData.get("body_ar") as string;

  const supabase = await createClient();

  await supabase.from("announcements").insert({
    subject_id: subjectId || null,
    title_ar: titleAr,
    body_ar: bodyAr,
    created_by: userId,
  });

  revalidatePath("/admin/announcements");
}