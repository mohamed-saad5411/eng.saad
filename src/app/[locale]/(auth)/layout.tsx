import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { notFound } from "next/navigation";



type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};


export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params;

  if (locale !== "ar" && locale !== "en") {
    notFound();
  }
  
  return (
    <>
      <Navbar locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale} />
    </>
  );
}

