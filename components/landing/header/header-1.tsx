"use client";

import { useState, useEffect, useReducer } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import useSWR from "swr";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/landing/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAppContext } from "@/context/app";
import AccountButton from "@/components/buttons/account-button";

const navItems = [
  { title: "Home", href: "#home" },
  { title: "Blog", href: "#blog" },
  { title: "Pricing", href: "#pricing" },
];

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Header1() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, toggleMenu] = useReducer((prev) => !prev, false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("GuestHeader");

  const { setBilling, setUser } = useAppContext();
  const { isSignedIn, isLoaded } = useAuth();

  // Only fetch /api/app if user is signed in and auth is loaded
  const { data, error } = useSWR(
    isLoaded && isSignedIn ? "/api/app" : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setBilling(data.billing);
      setUser(data.user);
    }
  }, [data, setBilling, setUser]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) toggleMenu(); // Only close if it's open
  }, [pathname]);

  const scrollToSection = (id: string) => {
    if (!id.includes("#")) {
      router.push(id);
      return;
    }

    if (typeof window !== "undefined") {
      const element = document.getElementById(id.replace("#", ""));
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-200",
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-screen-xl px-5 md:px-5 lg:px-10 2xl:px-0">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Logo />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-6">
              {navItems.map(({ title, href }) => (
                <button
                  key={href}
                  onClick={() => scrollToSection(href)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t(title)}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {isSignedIn ? (
                <AccountButton />
              ) : isLoaded ? (
                <>
                  <Link className="md:flex hidden" href="/sign-in">
                    <Button variant="outline" size="sm">
                      {t("SignIn")}
                    </Button>
                  </Link>
                  <Link className="md:flex hidden" href="/sign-up">
                    <Button size="sm">{t("SignUp")}</Button>
                  </Link>
                </>
              ) : null}

              {/* Mobile Menu Toggle */}
              <div className="flex md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle Menu"
                  onClick={() => {
                    toggleMenu();
                  }}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            isOpen={isOpen}
            onClose={toggleMenu}
            navItems={navItems}
          />
        )}
      </AnimatePresence>
    </>
  );
}
