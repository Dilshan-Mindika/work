"use client";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/app";
import Link from "next/link";
import BillingPortalButton from "@/components/buttons/billing-portal";
import BillingRefreshButton from "@/components/buttons/billing-refresh-button";
import { isUsedCredits } from "@/lib/config/pricing";

export default function BillingInfo() {
  const { billing } = useAppContext();
  return (
    <Card>
      <CardHeader className="">
        <div className="flex items-center">
          <CardTitle className="text-[14px] opacity-80">
            Manage your billing
          </CardTitle>
          <BillingRefreshButton
            variant="ghost"
            size="sm"
            showText={false}
            className="flex-1 md:flex-none hover:bg-transparent opacity-80"
          />
        </div>
      </CardHeader>
      <CardContent className="-mt-5">
        <div className="py-4">
          <p className=" font-thin">
            Current plan{" "}
            <span className=" font-bold">
              {billing?.details.name || "Free"}
            </span>
          </p>
          {isUsedCredits && (
            <p className="text-sm text-muted-foreground mt-1">
              Credits: {billing?.credits || 0}
            </p>
          )}
        </div>
        <div className="md:flex space-y-2 md:space-y-0 md:space-x-2 mt-5">
          <BillingPortalButton />

          <Link href="/app/billing/upgrade-plan">
            <Button size="lg" variant="ghost">
              <ArrowUp />
              <span>Upgrade my plan</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
