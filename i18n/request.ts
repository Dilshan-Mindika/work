// Import the getRequestConfig function from next-intl/server
import { getRequestConfig } from "next-intl/server";

// Import the routing configuration
import { routing } from "./routing";

// Export the default request configuration
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    // Return the locale and the corresponding messages
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
