import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/scroll-top";
import { TailwindIndicator } from "@/components/tailwindIndicator";
import Script from "next/script";

async function getMessages(locale: string) {
  try {
    return (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Missing translation file for locale: ${locale}`);
    }
    return {};
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const messages = await getMessages(resolvedParams.locale);

  return (
    <NextIntlClientProvider
      locale={resolvedParams.locale}
      messages={messages}
    >
      {/* Google Analytics - Replace GA_MEASUREMENT_ID with your actual Google Analytics ID */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
            }}
          />
        </>
      )}

      <Toaster />
      <ScrollToTop />
      {children}
      {process.env.NODE_ENV === "development" && <TailwindIndicator />}
    </NextIntlClientProvider>
  );
}
