// Import the defineRouting function from next-intl/routing
import { defineRouting } from "next-intl/routing";

// Import the locales configuration
import { locales } from "@/lib/config/locales";

// Define the routing configuration
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales.values,

  // Used when no locale matches
  defaultLocale: locales.default,
});
