export const publicRoutes = [
  // Auth Routes
  "/:locale/sign-in(.*)",
  "/sign-in(.*)",
  "/:locale/sign-up(.*)",
  "/sign-up(.*)",

  // Landing Page Routes
  "/:locale",
  "/",
  "/:locale/blog(.*)",
  "/blog(.*)",

  // Legal Routes
  "/terms(.*)",
  "/:locale/terms(.*)",
  "/privacy(.*)",
  "/:locale/privacy(.*)",

  // Public API Routes
  "/api/webhook(.*)",
  "/api/public(.*)",
  "/api/payments/lemonsqueezy/create-checkout(.*)",
];
