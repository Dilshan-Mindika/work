"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface FooterLinkTypes {
  label: string;
  external?: boolean;
  href: string;
  className?: string;
  parentTitle?: string;
}

export const FooterLink = ({
  label,
  external = false,
  href,
  className = "",
  parentTitle,
}: FooterLinkTypes) => {
  const t = useTranslations("GuestFooter");

  const translationKey = parentTitle
    ? `${parentTitle}.${label}`
    : `GuestFooter.${label}`;

  return (
    <Link
      href={href}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined} // Improves security for external links
      className={cn("text-[14px] leading-[18px] hover:underline", className)}
    >
      {t(translationKey)}
    </Link>
  );
};
