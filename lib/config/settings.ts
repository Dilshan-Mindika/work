import { FooterLinkTypes } from "@/components/landing/footer-link";

/**
 * SITE CONFIGURATION
 * Update these values to customize your application
 */

/** The name of your application */
export const SiteName = "Founderflow Boilerplate";

/**
 * Main site settings interface
 */
export interface SiteSettingsType {
  /** Short name for your application */
  name: string;
  /** Path to logo image for light theme */
  logoUrlLight: string;
  /** Path to logo image for dark theme */
  logoUrlDark: string;
  /** Default theme when user first visits */
  defaultTheme: "system" | "light" | "dark";
  /** Your domain name (used for SEO and metadata) */
  domainName: string;
  /** Full URL of your application */
  domainUrl: string;
}

/**
 * ⚠️  IMPORTANT: Update these settings for your application
 */
export const SiteSettings: SiteSettingsType = {
  name: "Founderflow",
  logoUrlLight: "/static/images/light-logo.png",
  logoUrlDark: "/static/images/dark-logo.png",
  defaultTheme: "light",
  domainName: "Founderflow.online",
  domainUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://Founderflow.online",
};

/**
 * Footer navigation configuration
 */
interface FooterData {
  Links: FooterLinkTypes[];
  More: FooterLinkTypes[];
}

/**
 * ⚠️  Update these links to match your application's navigation
 */
export const footerData: FooterData = {
  Links: [
    {
      label: "Login",
      href: "/login",
      external: false,
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Support",
      href: "/support",
    },
    {
      label: "Documentation",
      href: "/doc",
    },
  ],
  More: [
    {
      label: "Login",
      href: "/login",
      external: false,
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Support",
      href: "/support",
    },
    {
      label: "Documentation",
      href: "/doc",
    },
  ],
};

/**
 * SOCIAL MEDIA LINKS
 * 
 * ⚠️  Update these with your actual social media profiles
 * Leave empty strings for platforms you don't use
 */
export const SocialLink = {
  facebook: "",
  instagram: "",
  tiktok: "",
  x: "",
  youtube: "",
  linkedin: "",
  pinterest: "",
  snapchat: "",
  reddit: "",
  github: "",
  discord: "",
};

/**
 * LEMON SQUEEZY CONFIGURATION
 * 
 * ⚠️  IMPORTANT: Replace these with your actual Lemon Squeezy store details
 * Get these values from your Lemon Squeezy dashboard
 */
export const lemonSqueezyStoreId = 0; // Replace with your actual store ID
export const lemonSqueezyStoreUrl = ""; // Replace with your store URL
