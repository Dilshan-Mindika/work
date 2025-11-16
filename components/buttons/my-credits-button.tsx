"use client";

import { useAppContext } from "@/context/app";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";
import { useState } from "react";
import { CreditTopUpDialog } from "@/components/credit-top-up-dialog";
import { useAuth } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "@/i18n/navigation";

export default function MyCreditsButton() {
  const { isSignedIn } = useAuth();
  const { billing } = useAppContext();
  console.log(billing);

  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      {!isSignedIn ? (
        <></>
      ) : (
        <>
          {billing?.plan === "free" ? (
            <Link href="/app/billing/upgrade-plan">
              <Button>Upgrade Plan</Button>
            </Link>
          ) : (
            <>
              <Button
                onClick={() => setShowDialog(!showDialog)}
                variant="secondary"
                className="md:flex hidden"
              >
                <CoinsIcon />
                {billing?.credits} Credits
              </Button>

              {showDialog && (
                <CreditTopUpDialog open={showDialog} setOpen={setShowDialog} />
              )}

              <Popover>
                <PopoverTrigger className="flex md:hidden">
                  <CoinsIcon className="size-[18px]" />
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    <Button
                      onClick={() => setShowDialog(!showDialog)}
                      variant="secondary"
                      className="w-full"
                    >
                      <CoinsIcon />
                      {billing?.credits} Credits, Topup
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </>
      )}
    </>
  );
}
