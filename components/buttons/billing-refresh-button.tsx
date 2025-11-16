"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useBillingRefresh } from "@/hooks/use-billing-refresh";
import { cn } from "@/lib/utils";

interface BillingRefreshButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export default function BillingRefreshButton({
  variant = "outline",
  size = "default",
  showText = true,
  className,
  onSuccess,
}: BillingRefreshButtonProps) {
  const { refresh, isRefreshing, error } = useBillingRefresh();

  const handleRefresh = async () => {
    await refresh();
    if (!error && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(className)}
      title="Refresh billing data"
    >
      <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
      {showText && <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>}
    </Button>
  );
}