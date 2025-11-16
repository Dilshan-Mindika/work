import UpgradePlanComponents from "@/components/platform/billing/upgrade-plan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Upgrade Plan`,
};

export default function UpgradePlanPage() {
  return <UpgradePlanComponents />;
}
