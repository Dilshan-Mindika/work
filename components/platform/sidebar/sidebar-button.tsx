"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SidebarButtonTypes = {
  children: ReactNode;
  path: string;
  onClick: () => void;
};

export default function SidebarButton({
  path,
  children,
  onClick,
}: SidebarButtonTypes) {
  const pathname = usePathname();

  const isActive = pathname === path;
  return (
    <Link
      href={path}
      className={cn(
        "text-left hover:opacity-100 hover:scale-[1.02] duration-300 opacity-60 space-x-2 px-4 py-2 rounded-md flex justify-start items-center h-[45px] text-md ",
        isActive && " bg-secondary text-secondary-foreground opacity-100"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
