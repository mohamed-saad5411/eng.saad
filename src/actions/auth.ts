"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    redirect("/login?error=" + encodeURIComponent("البريد الإلكتروني أو كلمة السر غير صحيحة"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role === "subject_admin" || profile?.role === "super_admin") redirect("/admin/dashboard");
  if (profile?.role === "parent") redirect("/parent/dashboard");
  redirect("/student/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const studentPhone = formData.get("student_phone") as string;
  const parentPhone = formData.get("parent_phone") as string;
  const fatherStatus = formData.get("father_status") as string;
  const programId = formData.get("program_id") as string;
  const idDocument = formData.get("id_document") as File | null;
  const deathCertificate = formData.get("death_certificate") as File | null;

  if (!idDocument || idDocument.size === 0) {
    redirect("/register?error=" + encodeURIComponent("لازم ترفع صورة إثبات الهوية"));
  }
  if (fatherStatus === "deceased" && (!deathCertificate || deathCertificate.size === 0)) {
    redirect("/register?error=" + encodeURIComponent("لازم ترفع شهادة وفاة الأب"));
  }
  if (!programId) {
    redirect("/register?error=" + encodeURIComponent("لازم تختار برنامجك"));
  }

  const admin = createAdminClient();

  // 1. create the auth user directly (confirmed — no email-verification step for now)
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    redirect("/register?error=" + encodeURIComponent(createError?.message ?? "فشل إنشاء الحساب — يمكن الإيميل مستخدم قبل كده"));
  }

  const userId = created.user.id;

  // 2. upload documents to the private "student-documents" bucket
  const idPath = `${userId}/id-${Date.now()}-${idDocument!.name}`;
  const { error: idUploadError } = await admin.storage.from("student-documents").upload(idPath, idDocument!);
  if (idUploadError) {
    await admin.auth.admin.deleteUser(userId); // roll back the auth user so they can retry cleanly
    redirect("/register?error=" + encodeURIComponent("فشل رفع صورة الهوية"));
  }

  let deathCertPath: string | null = null;
  if (deathCertificate && deathCertificate.size > 0) {
    deathCertPath = `${userId}/death-cert-${Date.now()}-${deathCertificate.name}`;
    await admin.storage.from("student-documents").upload(deathCertPath, deathCertificate);
  }

  // 3. profile + student rows
  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    role: "student",
    full_name: fullName,
    email,
    phone,
  });

  const { error: studentError } = await admin.from("students").insert({
    id: userId,
    program_id: programId,
    student_phone: studentPhone,
    parent_phone: parentPhone,
    father_status: fatherStatus,
    id_document_path: idPath,
    death_certificate_path: deathCertPath,
  });

  if (profileError || studentError) {
    await admin.auth.admin.deleteUser(userId);
    redirect("/register?error=" + encodeURIComponent("حصل خطأ أثناء إنشاء حسابك، حاول تاني"));
  }

  redirect("/login?registered=1");
}