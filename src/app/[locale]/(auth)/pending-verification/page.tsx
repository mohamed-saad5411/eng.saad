"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/routing"; // عدّل المسار حسب إعداد next-intl عندك
import { createClient } from "@/lib/supabase/client";

const POLL_INTERVAL_MS = 15_000;

export default function PendingVerificationPage() {
  const t = useTranslations("Status.pending");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const router = useRouter();
  const supabase = createClient();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      setChecking(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: student } = await supabase
        .from("students")
        .select("verification_status")
        .eq("id", user.id)
        .single();

      setChecking(false);

      if (student?.verification_status === "verified") {
        router.push("/student/dashboard");
        router.refresh();
      } else if (student?.verification_status === "rejected") {
        router.push("/verification-rejected");
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [router, supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div dir={dir} className="min-h-screen bg-[#F3EEE3] flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-[#182018] flex items-center justify-center">
          <svg
            className={`w-6 h-6 text-[#C9973F] ${checking ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-serif text-2xl text-[#182018] mb-3">{t("title")}</h1>
        <p className="text-sm text-[#6B6152] leading-relaxed mb-2">{t("body")}</p>
        <p className="text-xs text-[#9B8F73] mb-8">{t("checkBack")}</p>

        <button
          onClick={handleSignOut}
          className="text-sm text-[#8A6E2F] hover:text-[#C9973F] underline underline-offset-2"
        >
          {t("signOut")}
        </button>
      </div>
    </div>
  );
}