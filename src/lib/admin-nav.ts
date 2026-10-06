import { Home, BookOpen, Users, ClipboardCheck, CreditCard } from "lucide-react";
import type { NavItem } from "@/components/dashboard/shell";

const labels = {
  ar: { home: "الرئيسية", content: "المحتوى", students: "الطلاب", exams: "الامتحانات", commerce: "الاشتراكات والمدفوعات" },
  en: { home: "Home", content: "Content", students: "Students", exams: "Exams", commerce: "Subscriptions & Payments" },
};

export function buildAdminNavItems(locale: "ar" | "en"): NavItem[] {
  const t = labels[locale];
  return [
    { href: "/admin/dashboard", label: t.home, icon: Home },
    { href: "/admin/content", label: t.content, icon: BookOpen },
    { href: "/admin/students", label: t.students, icon: Users },
    { href: "/admin/exams", label: t.exams, icon: ClipboardCheck },
    { href: "/admin/commerce", label: t.commerce, icon: CreditCard },
  ];
}