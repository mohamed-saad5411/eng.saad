"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/lib/i18n/routing"; // عدّل المسار حسب إعداد next-intl عندك
import { createClient } from "@/lib/supabase/client";

type Child = {
  id: string;
  full_name: string;
  grade: string;
};

export default function SelectChildPage() {
  const t = useTranslations("Parent.selectChild");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const router = useRouter();
  const supabase = createClient();

  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("student_parents")
        .select("student_id, students(id, grade, profiles(full_name))")
        .eq("parent_id", user.id);

      const mapped: Child[] =
        data?.map((row: any) => ({
          id: row.students.id,
          full_name: row.students.profiles.full_name,
          grade: row.students.grade,
        })) ?? [];

      setChildren(mapped);
      setLoading(false);
    }

    load();
  }, [router, supabase]);

  function handleContinue() {
    if (!selected) return;
    localStorage.setItem("selectedChildId", selected);
    router.push("/parent/dashboard");
  }

  if (loading) return null;

  return (
    <div dir={dir} className="min-h-screen bg-[#F3EEE3] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-[#182018] mb-2 text-center">{t("title")}</h1>
        <p className="text-sm text-[#6B6152] mb-8 text-center">{t("subtitle")}</p>

        <div className="space-y-3 mb-8">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelected(child.id)}
              className={`w-full text-start rounded-md border px-4 py-3 transition ${
                selected === child.id
                  ? "border-[#C9973F] bg-[#FBF4E4]"
                  : "border-[#DCD3BE] bg-white hover:border-[#C9BBA0]"
              }`}
            >
              <div className="text-sm font-medium text-[#182018]">{child.full_name}</div>
              <div className="text-xs text-[#8A7B5C]">
                {t("gradeLabel")}: {child.grade}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full rounded-md bg-[#182018] text-[#F3EEE3] py-2.5 text-sm font-medium hover:bg-[#2A362A] disabled:opacity-40 transition"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}