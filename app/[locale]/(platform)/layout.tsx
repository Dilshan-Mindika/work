"use client";

import { FeedbackDialog } from "@/components/feedback-dialog";
import LoadUserData from "@/components/load-user-data";
import { AppSidebar } from "@/components/platform/sidebar/app-sidebar";
import SidebarHeader from "@/components/platform/sidebar/sidebar-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppProvider } from "@/context/app";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface Layout {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: Layout) {
  const pathname = usePathname();
  return (
    <>
      <AppProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SidebarHeader />
            <div
              className={cn(
                "mx-auto  mt-10",
                pathname !== "/profile" && "max-w-screen-xl px-4 md:px-10"
              )}
            >
              {children}
            </div>
            <LoadUserData />
            <FeedbackDialog />
          </main>
        </SidebarProvider>
      </AppProvider>
      ;
    </>
  );
}
