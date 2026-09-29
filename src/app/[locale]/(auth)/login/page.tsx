"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/routing";
import { createClient } from "@/lib/supabase/client";
// import { getPostLoginRedirect } from "@/lib/auth/post-login-redirect"; // عدّل المسار حسب مشروعك

export default function LoginPage() {
  const t = useTranslations("Auth.login");
  const tBrand = useTranslations("Auth");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      setLoading(false);
      setError(t("errorInvalid"));
      return;
    }

    const destination = await getPostLoginRedirect(supabase, signInData.user.id);
    setLoading(false);

    router.push(destination);
    router.refresh();
  }

  return (
    <div dir={dir} className="min-h-screen bg-[#F3EEE3] flex">
      {/* Brand panel */}
      <aside className="hidden lg:flex lg:w-[42%] relative bg-[#182018] text-[#F3EEE3] flex-col justify-between p-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 31px, #F3EEE3 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, #F3EEE3 32px)",
          }}
        />
        <div className="relative">
          <Link href="/">
            <span className="font-serif text-2xl tracking-tight">{tBrand("brandName")}</span>
          </Link>
        </div>

        <div className="relative space-y-6 max-w-sm">
          <p className="font-serif text-[2.75rem] leading-[1.15]">{t("heroTitle")}</p>
          <p className="text-[#C9AF7F] text-sm leading-relaxed">{t("heroSubtitle")}</p>
        </div>

        <div className="relative flex items-center gap-3 text-xs text-[#8FA294]">
          <span className="h-px w-8 bg-[#3A473C]" />
          <span>{t("heroTag")}</span>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 text-center">
            <span className="font-serif text-xl text-[#182018]">{tBrand("brandName")}</span>
          </div>

          <h1 className="font-serif text-3xl text-[#182018] mb-2">{t("title")}</h1>
          <p className="text-sm text-[#6B6152] mb-8">{t("subtitle")}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-[#3A3327] mb-1.5">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm text-[#3A3327]">
                  {t("password")}
                </label>
                <Link href="/forgot-password" className="text-xs text-[#8A6E2F] hover:text-[#C9973F]">
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#DCD3BE] bg-white px-3.5 py-2.5 pl-10 text-[#182018] placeholder:text-[#B0A78F] focus:outline-none focus:ring-2 focus:ring-[#C9973F]/40 focus:border-[#C9973F] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7B5C] hover:text-[#3A3327]"
                >
                  {showPassword ? t("hide") : t("show")}
                </button>
              </div>
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

          <p className="mt-8 text-center text-sm text-[#6B6152]">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-[#8A6E2F] hover:text-[#C9973F] font-medium">
              {t("createAccount")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}