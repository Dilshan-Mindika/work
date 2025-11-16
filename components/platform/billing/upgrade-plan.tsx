import Pricing from "@/components/landing/pricing/pricing-1";

export default function UpgradePlanComponents() {
  return (
    <section className="mt-10 w-full ">
      <div>
        <p>Upgrade your current plan</p>
      </div>
      <div className="mt-5 flex w-full ">
        <Pricing onlyPricingCard />
      </div>
    </section>
  );
}
