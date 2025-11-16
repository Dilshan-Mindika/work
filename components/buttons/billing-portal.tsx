"use client";
import { Button } from "@/components/ui/button";
import { paymentProvider } from "@/lib/config/pricing";
import { lemonSqueezyStoreUrl } from "@/lib/config/settings";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
export default function BillingPortalButton() {
  const router = useRouter();

  const billingUrl =
    paymentProvider === "stripe"
      ? "/app/billing/upgrade-plan"
      : `${lemonSqueezyStoreUrl}/billing`;
  return (
    <Button
      className={cn("text-[16px]")}
      variant="outline"
      size="lg"
      onClick={() => router.push(billingUrl)}
    >
      <CreditCard />
      <span>Manage my billing</span>
    </Button>
  );
}
