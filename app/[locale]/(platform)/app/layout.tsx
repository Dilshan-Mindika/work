"use client";

import { useAppContext } from "@/context/app";
import { useEffect, useState } from "react";
import { FeedbackDialog } from "@/components/feedback-dialog";
import DynamicBreadcrumb from "@/components/platform/dynamic-breadcrumb";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <DynamicBreadcrumb />
        {children}
      </div>
    </>
  );
}
