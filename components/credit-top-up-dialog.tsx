import { Credits, paymentProvider } from "@/lib/config/pricing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckoutButton from "@/components/buttons/checkout-button";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap } from "lucide-react";

export const CreditTopUpDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [selectedProvider, setSelectedProvider] = useState<
    "stripe" | "lemonsqueezy" | "webxpay"
  >(paymentProvider);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Topup Credits</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-[14px] font-medium opacity-80 mb-4">
            select a credit package to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-4 md:gap-y-3 md:grid-cols-3 gap-x-4">
          {Credits.plans.map((plan, idx) => (
            <CheckoutButton
              priceId={plan.priceId}
              variantId={plan.variantId}
              mode="payment"
              className="cursor-pointer hover:scale-[1.04] py-10 text-left duration-200 border bg-card"
              key={idx}
              variant="ghost"
            >
              <div className="">
                <p className="font-black text-[16px] leading-[16px]">
                  {plan.title}
                </p>
                <p className="text-[14px] mt-1 opacity-80">$ {plan.price}</p>
              </div>
            </CheckoutButton>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
