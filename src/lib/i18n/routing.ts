import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

// UI locales ONLY. This is unrelated to a program's content_language
// (which can be ar / en / de) — see /types/program.ts and the schema notes.
export const routing = defineRouting({
    locales: ["ar", "en"],
    defaultLocale: "ar",

    // "always": every URL carries the locale prefix, e.g. /ar, /en/about
    // Keeps routing unambiguous and matches the [locale] segment structure.
    localePrefix: "always",
});

// Typed wrappers around next/navigation that respect the routing config above.
// Use these (Link, useRouter, usePathname, redirect) instead of the raw
// next/navigation / next/link imports anywhere inside app/[locale]/**.
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);

export type Locale = (typeof routing.locales)[number];
