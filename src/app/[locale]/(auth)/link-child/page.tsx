"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/routing"; // عدّل المسار حسب إعداد next-intl عندك
import { createClient } from "@/lib/supabase/client";

export default function LinkChildPage() {
  const t = useTranslations("Parent.linkChild");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const router = useRouter();
  const supabase = createClient();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Safe lookup: this RPC returns only the student's id + first name,
    // never the full row, since RLS blocks a direct SELECT for a parent
    // who isn't linked yet.
    const { data: matches, error: rpcError } = await supabase.rpc(
      "find_student_by_phone",
      { phone }
    );

    if (rpcError || !matches || matches.length === 0) {
      setLoading(false);
      setError(t("notFound"));
      return;
    }

    const { error: insertError } = await supabase.from("parent_link_requests").insert({
      parent_id: user.id,
      student_id: matches[0].student_id,
    });

    setLoading(false);

    if (insertError) {
      setError(t("genericError"));
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div dir={dir} className="min-h-screen bg-[#F3EEE3] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-[#0F6E56] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-[#182018] mb-3">{t("successTitle")}</h1>
          <p className="text-sm text-[#6B6152] leading-relaxed mb-8">{t("successBody")}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setPhone("");
            }}
            className="text-sm text-[#8A6E2F] hover:text-[#C9973F] underline underline-offset-2"
          >
            {t("linkAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-[#F3EEE3] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-[#182018] mb-2 text-center">{t("title")}</h1>
        <p className="text-sm text-[#6B6152] mb-8 text-center">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="phone" className="block text-sm text-[#3A3327] mb-1.5">
              {t("phoneLabel")}
            </label>
            <input
              id="phone"
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
            />
          </div>

          {error && (
            <p className="text-sm text-[#A23B2E] bg-[#A23B2E]/8 border border-[#A23B2E]/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#182018] text-[#F3EEE3] py-2.5 text-sm font-medium hover:bg-[#2A362A] disabled:opacity-60 transition"
          >
            {loading ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}