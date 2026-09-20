// import { NextIntlClientProvider } from "next-intl";
// import { getMessages, setRequestLocale } from "next-intl/server";
// import { routing } from "@/lib/i18n/routing";
// import { notFound } from "next/navigation";
// import { Navbar } from "@/components/landing/navbar";
// import { Footer } from "@/components/landing/footer";

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({ locale }));
// }

// export default async function LocaleLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;

//   // تحقق إن الـ locale صالح
//   // if (!routing.locales.includes(locale as "ar" | "en")) {
//   //   notFound();
//   // }
//   if (locale !== "ar" && locale !== "en") notFound();
//   setRequestLocale(locale);

//   const messages = await getMessages();

//   return (
//     <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
//       <body>
//         <NextIntlClientProvider locale={locale} messages={messages}>
//           {/* {children} */}
//           <Navbar locale={locale} />
//           <main className="min-h-screen">{children}</main>
//           <Footer locale={locale} />
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }


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