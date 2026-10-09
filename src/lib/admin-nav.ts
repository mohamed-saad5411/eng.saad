import {
  Home,
  BookOpen,
  Users,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  ChartNoAxesCombined,
} from "lucide-react";
import type { NavItem } from "@/components/dashboard/shell";

const labels = {
  ar: {
    home: "الرئيسية",
    academic: "المواد والبرامج",
    content: "المحتوى",
    students: "الطلاب",
    exams: "الامتحانات",
    commerce: "الاشتراكات والمدفوعات",
    analytics: "التحليلات",
  },
  en: {
    home: "Home",
    academic: "Academic",
    content: "Content",
    students: "Students",
    exams: "Exams",
    commerce: "Subscriptions & Payments",
    analytics: "Analytics",
  },
};

export function buildAdminNavItems(locale: "ar" | "en"): NavItem[] {
  const t = labels[locale];
  return [
    { href: "/admin/dashboard", label: t.home, icon: Home },
    { href: "/admin/academic", label: t.academic, icon: GraduationCap },
    { href: "/admin/content", label: t.content, icon: BookOpen },
    { href: "/admin/students", label: t.students, icon: Users },
    { href: "/admin/exams", label: t.exams, icon: ClipboardCheck },
    { href: "/admin/commerce", label: t.commerce, icon: CreditCard },
    { href: "/admin/analytics", label: t.analytics, icon: ChartNoAxesCombined },
  ];
}