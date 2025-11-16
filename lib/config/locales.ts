/**
 * Locale configuration for the application
 *
 * This file defines the supported locales and default language settings
 * Used for internationalization (i18n) throughout the app
 */

export const locales = {
  // Array of supported locale codes
  values: ["en"],

  // The fallback locale if none is specified
  default: "en",

  // Locale options shown in language selector dropdown
  // Each option has a human-readable label and locale code value
  dropdown: [{ label: "English", value: "en" }],
};
