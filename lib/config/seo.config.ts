import { Metadata } from "next";
import { SiteSettings } from "./settings";

const SEO_CONFIG: Metadata = {
  title: {
    template: `%s | ${SiteSettings.name}`,
    default: "Founderflow - Modern Next.js SaaS Boilerplate",
  },
  description:
    "A modern, fully featured Next.js boilerplate with authentication, subscriptions, i18n, beautiful UI components, and everything you need to launch your SaaS quickly.",
  keywords:
    "nextjs, saas, boilerplate, authentication, subscriptions, i18n, ui components, typescript",
  icons: "/static/favicon.ico",
  openGraph: {
    type: "website",
    siteName: "Founderflow",
    locale: "en_US",
    url: "https://Founderflow.online",
    title: "Founderflow - Next.js SaaS Boilerplate",
    description:
      "A modern, fully featured Next.js boilerplate with authentication, subscriptions, i18n, beautiful UI components, and everything you need to launch your SaaS quickly.",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Founderflow - Next.js SaaS Boilerplate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Founderflowdev",
    title: "Founderflow - Next.js SaaS Boilerplate",
    description:
      "A modern, fully featured Next.js boilerplate with authentication, subscriptions, i18n, beautiful UI components, and everything you need to launch your SaaS quickly.",
    images: ["/og-blog.jpg"],
  },
};

export default SEO_CONFIG;
