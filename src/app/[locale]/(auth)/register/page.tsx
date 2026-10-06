// "use client";

// import { useState } from "react";
// import { useTranslations, useLocale } from "next-intl";
// import { Link, useRouter } from "@/lib/i18n/routing";
// import { createClient } from "@/lib/supabase/client";

// const FATHER_STATUS = ["working", "retired", "deceased"] as const;
// type FatherStatus = (typeof FATHER_STATUS)[number];

// function FileField({
//   id,
//   label,
//   file,
//   onChange,
//   required,
//   promptLabel,
//   chooseLabel,
// }: {
//   id: string;
//   label: string;
//   file: File | null;
//   onChange: (f: File | null) => void;
//   required?: boolean;
//   promptLabel: string;
//   chooseLabel: string;
// }) {
//   return (
//     <div>
//       <label htmlFor={id} className="block text-sm text-[#3A3327] mb-1.5">
//         {label}
//       </label>
//       <label
//         htmlFor={id}
//         className="flex items-center justify-between rounded-md border border-dashed border-[#C9BBA0] bg-white px-3.5 py-2.5 cursor-pointer hover:border-[#C9973F] transition"
//       >
//         <span className="text-sm text-[#8A7B5C] truncate">{file ? file.name : promptLabel}</span>
//         <span className="text-xs text-[#8A6E2F] shrink-0 ms-3">{chooseLabel}</span>
//       </label>
//       <input
//         id={id}
//         type="file"
//         accept="image/*,application/pdf"
//         required={required}
//         onChange={(e) => onChange(e.target.files?.[0] ?? null)}
//         className="sr-only"
//       />
//     </div>
//   );
// }

// export default function RegisterPage() {
//   const t = useTranslations("Auth.register");
//   const tBrand = useTranslations("Auth");
//   const locale = useLocale();
//   const dir = locale === "ar" ? "rtl" : "ltr";

//   const router = useRouter();
//   const supabase = createClient();

//   const GRADES = [
//     { value: "1", label: t("grade1") },
//     { value: "2", label: t("grade2") },
//     { value: "3", label: t("grade3") },
//   ];

//   const SUBJECTS = [
//     { value: "math", label: t("subjectMath") },
//     { value: "statistics", label: t("subjectStatistics") },
//     { value: "business", label: t("subjectBusiness") },
//     { value: "math-de", label: t("subjectMathDe") },
//   ];

//   const FATHER_STATUS_OPTIONS: { value: FatherStatus; label: string }[] = [
//     { value: "working", label: t("fatherWorking") },
//     { value: "retired", label: t("fatherRetired") },
//     { value: "deceased", label: t("fatherDeceased") },
//   ];

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [grade, setGrade] = useState("");
//   const [subject, setSubject] = useState("");
//   const [studentPhone, setStudentPhone] = useState("");
//   const [parentPhone, setParentPhone] = useState("");
//   const [fatherStatus, setFatherStatus] = useState<FatherStatus | "">("");

//   const [idDocument, setIdDocument] = useState<File | null>(null);
//   const [deathCertificate, setDeathCertificate] = useState<File | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function uploadDocument(file: File, path: string) {
//     const { error: uploadError } = await supabase.storage
//       .from("student-documents")
//       .upload(path, file, { upsert: true });
//     if (uploadError) throw uploadError;
//     return path;
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);

//     if (!idDocument) {
//       setError(t("errorIdRequired"));
//       return;
//     }
//     if (fatherStatus === "deceased" && !deathCertificate) {
//       setError(t("errorDeathCertRequired"));
//       return;
//     }

//     setLoading(true);

//     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//       email,
//       password,
//       options: { data: { full_name: fullName } },
//     });

//     if (signUpError || !signUpData.user) {
//       setLoading(false);
//       setError(signUpError?.message ?? t("errorGeneric"));
//       return;
//     }

//     try {
//       const userId = signUpData.user.id;
//       const idDocPath = await uploadDocument(idDocument, `${userId}/id-document`);
//       const deathCertPath =
//         fatherStatus === "deceased" && deathCertificate
//           ? await uploadDocument(deathCertificate, `${userId}/death-certificate`)
//           : null;

//       const { error: profileError } = await supabase.from("students").insert({
//         user_id: userId,
//         full_name: fullName,
//         grade,
//         subject,
//         student_phone: studentPhone,
//         parent_phone: parentPhone,
//         father_status: fatherStatus,
//         id_document_path: idDocPath,
//         death_certificate_path: deathCertPath,
//       });

//       if (profileError) throw profileError;

//       router.push("/pending-verification");
//       router.refresh();
//     } catch {
//       setError(t("errorProfileSave"));
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div dir={dir} className="min-h-screen bg-[#F3EEE3] flex">
//       {/* Brand panel */}
//       <aside className="hidden lg:flex lg:w-[38%] relative bg-[#182018] text-[#F3EEE3] flex-col justify-between p-12 overflow-hidden">
//         <div
//           className="pointer-events-none absolute inset-0 opacity-[0.06]"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(0deg, transparent, transparent 31px, #F3EEE3 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, #F3EEE3 32px)",
//           }}
//         />
//         <div className="relative">
//           <Link href="/">
//             <span className="font-serif text-2xl tracking-tight">{tBrand("brandName")}</span>
//           </Link>
//         </div>

//         <div className="relative space-y-6 max-w-sm">
//           <p className="font-serif text-[2.5rem] leading-[1.15]">{t("heroTitle")}</p>
//           <p className="text-[#C9AF7F] text-sm leading-relaxed">{t("heroSubtitle")}</p>
//         </div>

//         <div className="relative flex items-center gap-3 text-xs text-[#8FA294]">
//           <span className="h-px w-8 bg-[#3A473C]" />
//           <span>{t("heroTag")}</span>
//         </div>
//       </aside>

//       {/* Form panel */}
//       <main className="flex-1 flex items-center justify-center px-6 py-14">
//         <div className="w-full max-w-lg">
//           <div className="lg:hidden mb-8 text-center">
//             <span className="font-serif text-xl text-[#182018]">{tBrand("brandName")}</span>
//           </div>

//           <h1 className="font-serif text-3xl text-[#182018] mb-2">{t("title")}</h1>
//           <p className="text-sm text-[#6B6152] mb-8">{t("subtitle")}</p>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Account */}
//             <section className="space-y-4">
//               <h2 className="text-xs font-medium text-[#8A6E2F] tracking-wide">
//                 {t("sectionAccount")}
//               </h2>

//               <div>
//                 <label htmlFor="fullName" className="block text-sm text-[#3A3327] mb-1.5">
//                   {t("fullName")}
//                 </label>
//                 <input
//                   id="fullName"
//                   type="text"
//                   required
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   placeholder={t("fullNamePlaceholder")}
//                   className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                 />
//               </div>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="email" className="block text-sm text-[#3A3327] mb-1.5">
//                     {t("email")}
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="example@email.com"
//                     className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="password" className="block text-sm text-[#3A3327] mb-1.5">
//                     {t("password")}
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     required
//                     minLength={8}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder={t("passwordHint")}
//                     className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Academic */}
//             <section className="space-y-4">
//               <h2 className="text-xs font-medium text-[#8A6E2F] tracking-wide">
//                 {t("sectionAcademic")}
//               </h2>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="grade" className="block text-sm text-[#3A3327] mb-1.5">
//                     {t("grade")}
//                   </label>
//                   <select
//                     id="grade"
//                     required
//                     value={grade}
//                     onChange={(e) => setGrade(e.target.value)}
//                     className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                   >
//                     <option value="" disabled>
//                       {t("gradeSelect")}
//                     </option>
//                     {GRADES.map((g) => (
//                       <option key={g.value} value={g.value}>
//                         {g.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="subject" className="block text-sm text-[#3A3327] mb-1.5">
//                     {t("subject")}
//                   </label>
//                   <select
//                     id="subject"
//                     required
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                   >
//                     <option value="" disabled>
//                       {t("subjectSelect")}
//                     </option>
//                     {SUBJECTS.map((s) => (
//                       <option key={s.value} value={s.value}>
//                         {s.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </section>

//             {/* Contact */}
//             <section className="space-y-4">
//               <h2 className="text-xs font-medium text-[#8A6E2F] tracking-wide">
//                 {t("sectionContact")}
//               </h2>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="studentPhone" className="block text-sm text-[#3A3327] mb-1.5">
//                     {t("studentPhone")}
//                   </label>
//                   <input
//                     id="studentPhone"
//                     type="tel"
//                     required
//                     dir="ltr"
//                     value={studentPhone}
//                     onChange={(e) => setStudentPhone(e.target.value)}
//                     placeholder={t("phonePlaceholder")}
//                     className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="parentPhone" className="block text-sm text-[#3A3327] mb-1.5">
//                     {t("parentPhone")}
//                   </label>
//                   <input
//                     id="parentPhone"
//                     type="tel"
//                     required
//                     dir="ltr"
//                     value={parentPhone}
//                     onChange={(e) => setParentPhone(e.target.value)}
//                     placeholder={t("phonePlaceholder")}
//                     className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Extra */}
//             <section className="space-y-4">
//               <h2 className="text-xs font-medium text-[#8A6E2F] tracking-wide">
//                 {t("sectionExtra")}
//               </h2>

//               <FileField
//                 id="idDocument"
//                 label={t("idDocument")}
//                 file={idDocument}
//                 onChange={setIdDocument}
//                 required
//                 promptLabel={t("uploadPrompt")}
//                 chooseLabel={t("uploadChoose")}
//               />

//               <div>
//                 <label htmlFor="fatherStatus" className="block text-sm text-[#3A3327] mb-1.5">
//                   {t("fatherStatus")}
//                 </label>
//                 <select
//                   id="fatherStatus"
//                   required
//                   value={fatherStatus}
//                   onChange={(e) => setFatherStatus(e.target.value as FatherStatus)}
//                   className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
//                 >
//                   <option value="" disabled>
//                     {t("fatherStatusSelect")}
//                   </option>
//                   {FATHER_STATUS_OPTIONS.map((s) => (
//                     <option key={s.value} value={s.value}>
//                       {s.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {fatherStatus === "deceased" && (
//                 <FileField
//                   id="deathCertificate"
//                   label={t("deathCertificate")}
//                   file={deathCertificate}
//                   onChange={setDeathCertificate}
//                   required
//                   promptLabel={t("uploadPrompt")}
//                   chooseLabel={t("uploadChoose")}
//                 />
//               )}
//             </section>

//             {error && (
//               <p className="text-sm text-[#A23B2E] bg-[#A23B2E]/8 border border-[#A23B2E]/20 rounded-md px-3 py-2">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-md bg-[#182018] text-[#F3EEE3] py-2.5 text-sm font-medium hover:bg-[#2A362A] disabled:opacity-60 transition"
//             >
//               {loading ? t("submitting") : t("submit")}
//             </button>
//           </form>

//           <p className="mt-8 text-center text-sm text-[#6B6152]">
//             {t("haveAccount")}{" "}
//             <Link href="/login" className="text-[#8A6E2F] hover:text-[#C9973F] font-medium">
//               {t("signIn")}
//             </Link>
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }


import { createClient } from "@/lib/supabase/server";
import { signUpAction } from "@/actions/auth";
import { FatherStatusField } from "@/components/auth/father-status-field";

const copy = {
  ar: {
    title: "إنشاء حساب طالب",
    fullName: "الاسم بالكامل",
    email: "البريد الإلكتروني",
    password: "كلمة السر",
    phone: "رقم تليفونك",
    studentPhone: "رقم تليفون الطالب",
    parentPhone: "رقم تليفون ولي الأمر",
    program: "برنامجك",
    choosePlaceholder: "اختر البرنامج",
    idDocument: "صورة إثبات الهوية",
    submit: "إنشاء الحساب",
    haveAccount: "عندك حساب بالفعل؟",
    login: "سجّل دخولك",
  },
  en: {
    title: "Create a student account",
    fullName: "Full name",
    email: "Email",
    password: "Password",
    phone: "Your phone number",
    studentPhone: "Student's phone number",
    parentPhone: "Parent's phone number",
    program: "Your program",
    choosePlaceholder: "Choose your program",
    idDocument: "ID document photo",
    submit: "Create account",
    haveAccount: "Already have an account?",
    login: "Log in",
  },
};

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = copy[locale];

  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("programs")
    .select("id, title")
    .eq("is_published", true)
    .order("title");

  return (
    <section className="container-page max-w-lg py-16">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={signUpAction} className="mt-8 flex flex-col gap-4" encType="multipart/form-data">
        <Field label={t.fullName} name="full_name" type="text" required />
        <Field label={t.email} name="email" type="email" required />
        <Field label={t.password} name="password" type="password" required minLength={6} />
        <Field label={t.phone} name="phone" type="tel" required />
        <Field label={t.studentPhone} name="student_phone" type="tel" required />
        <Field label={t.parentPhone} name="parent_phone" type="tel" required />

        <div>
          <label className="block text-sm font-medium">{t.program}</label>
          <select
            name="program_id"
            required
            className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm"
          >
            <option value="">{t.choosePlaceholder}</option>
            {(programs ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <FatherStatusField locale={locale} />

        <div>
          <label className="block text-sm font-medium">{t.idDocument}</label>
          <input type="file" name="id_document" accept="image/*,.pdf" required className="mt-1.5 w-full text-sm" />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-xl bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)]"
        >
          {t.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        {t.haveAccount}{" "}
        <a href="/login" className="font-semibold text-[var(--color-brand)]">
          {t.login}
        </a>
      </p>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        minLength={minLength}
        className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm"
      />
    </div>
  );
}