"use client";
import ScrollToTopButton from "@/components/buttons/scroll-to-top";
import Footer from "@/components/landing/footer/footer-1";
import Header from "@/components/landing/header/header-1";
import LoadUserData from "@/components/load-user-data";
import { AppProvider } from "@/context/app";
import { Suspense } from "react";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppProvider>
        <Suspense>
          <Header />
        </Suspense>
        <main className="flex flex-col min-h-screen">{children}</main>
        <ScrollToTopButton />
        <LoadUserData />
        <Footer />
      </AppProvider>
    </>
  );
}
