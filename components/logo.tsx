"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SiteSettings } from "@/lib/config/settings";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[120px] h-[45px] bg-gray-200 animate-pulse"></div>; // Skeleton loader until theme loads
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logoUrl =
    currentTheme === "dark"
      ? SiteSettings.logoUrlDark
      : SiteSettings.logoUrlLight;

  return (
    <div
      className={cn(
        "relative hover:scale-[1.02] duration-300 w-[120px] h-[45px]",
        className
      )}
    >
      <Image
        className="object-contain"
        src={logoUrl}
        fill
        sizes="120px"
        alt={`${SiteSettings.name} Logo`}
        priority
      />
    </div>
  );
};
