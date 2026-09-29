import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // params: Promise<{ locale: "ar" | "en" }>;
  params: Promise<{ locale: string }>
}) {
  // const { locale } = await params;
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "ar") as "ar" | "en";

  return (
    <>
      <Navbar locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale} />
    </>
  );
}