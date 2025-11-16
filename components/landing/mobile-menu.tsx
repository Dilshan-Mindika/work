"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useTranslations } from "next-intl";
import { useAuth, UserButton } from "@clerk/nextjs";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: {
    title: string;
    href: string;
  }[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const pathname = usePathname();
  const t = useTranslations("GuestHeader");

  const { isLoaded, isSignedIn } = useAuth();

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="closed"
      animate="open"
      exit="closed"
      variants={menuVariants}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close Menu"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-8">
        <nav className="flex flex-col items-center space-y-6">
          {navItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                className={cn(
                  "text-3xl font-bold transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-foreground"
                )}
                onClick={onClose}
              >
                {t(item.title)}
              </Link>
            </motion.div>
          ))}
        </nav>

        {isLoaded && (
          <>
            {isSignedIn ? (
              <></>
            ) : (
              <motion.div
                variants={itemVariants}
                className="mt-12 flex flex-col items-center space-y-4"
              >
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full max-w-xs"
                  >
                    {t("SignIn")}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="lg" className="w-full max-w-xs">
                    {t("SignUp")}
                  </Button>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
