"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/routing"; // عدّل المسار حسب إعداد next-intl عندك
import { createClient } from "@/lib/supabase/client";

export default function VerificationRejectedPage() {
  const t = useTranslations("Status.rejected");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const router = useRouter();
  const supabase = createClient();
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: student } = await supabase
        .from("students")
        .select("rejection_reason, verification_status")
        .eq("id", user.id)
        .single();

      if (student?.verification_status === "verified") {
        router.push("/student/dashboard");
        return;
      }
      if (student?.verification_status === "pending") {
        router.push("/pending-verification");
        return;
      }

      setReason(student?.rejection_reason ?? null);
    }

    load();
  }, [router, supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div dir={dir} className="min-h-screen bg-[#F3EEE3] flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-[#A23B2E] flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[#F3EEE3]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-serif text-2xl text-[#182018] mb-3">{t("title")}</h1>
        <p className="text-sm text-[#6B6152] leading-relaxed mb-4">{t("body")}</p>

        <div className="text-sm text-[#3A3327] bg-white border border-[#DCD3BE] rounded-md px-4 py-3 mb-8 text-start">
          <span className="font-medium">{t("reasonLabel")}</span>{" "}
          {reason ?? t("noReason")}
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/201000000000" // عدّل الرقم
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-md bg-[#182018] text-[#F3EEE3] py-2.5 text-sm font-medium hover:bg-[#2A362A] transition"
          >
            {t("contactSupport")}
          </a>
          <button
            onClick={handleSignOut}
            className="text-sm text-[#8A6E2F] hover:text-[#C9973F] underline underline-offset-2"
          >
            {t("signOut")}
          </button>
        </div>
      </div>
    </div>
  );
}