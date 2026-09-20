import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// IMPORTANT: this function MUST be named `middleware` (or exported as default).
// Next.js only recognizes that exact export as the middleware entry point.
export function middleware(request: Request) {
  return intlMiddleware(request as any);
}

export const config = {
  // Everything except static files, _next internals, and API routes.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
