import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { locales } from "@/lib/config/locales";
import { publicRoutes } from "@/lib/routes";
import { NextResponse } from "next/server";
import { checkEnvironmentVariables } from "@/lib/env-checker";

// Configure i18n middleware
const intlMiddleware = createMiddleware({
  locales: locales.values,
  defaultLocale: locales.default,
});

// Create a matcher for public routes
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  // Skip ALL middleware processing for static files, setup page and API routes
  if (
    pathname === "/setup" ||
    pathname.startsWith("/api/setup") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/trpc") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check environment variables FIRST - before any other processing
  try {
    const envResult = checkEnvironmentVariables();
    
    // If critical environment variables are missing, redirect to setup
    if (!envResult.isComplete) {
      const url = req.nextUrl.clone();
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // If environment check fails, redirect to setup
    const url = req.nextUrl.clone();
    url.pathname = "/setup";
    return NextResponse.redirect(url);
  }

  // Only proceed with locale redirect if environment is complete
  // Redirect "/" to default or user-selected locale
  if (pathname === "/") {
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
    const locale =
      cookieLocale && locales.values.includes(cookieLocale)
        ? cookieLocale
        : locales.default;

    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  if (!isPublicRoute(req)) {
    await auth.protect(); // Protect private routes
  }

  const intlResponse = intlMiddleware(req);

  return intlResponse;
});

// Define config for the middleware
export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
    // Explicitly match root path
    "/"
  ],
};
