// import "./globals.css";

// import { NextIntlClientProvider } from "next-intl";
// import { getMessages } from "next-intl/server";


// export default async function LocaleLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   const messages = await getMessages();

//   return (
//     <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
//       <body>
//         <NextIntlClientProvider messages={messages}>
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }


import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "ar" && locale !== "en") notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}