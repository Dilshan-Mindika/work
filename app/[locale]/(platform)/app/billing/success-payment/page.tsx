"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/app";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessPaymentPage() {
  const { refreshBillingData, billing } = useAppContext();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const handleSuccessPayment = async () => {
      try {
        // Wait a bit to ensure webhook has processed
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Refresh billing data to get updated plan and credits
        await refreshBillingData();

        setIsRefreshing(false);
      } catch (error) {
        console.error("Error refreshing billing data:", error);
        setIsRefreshing(false);
      }
    };

    handleSuccessPayment();
  }, [refreshBillingData]);

  const handleGoToDashboard = () => {
    router.push("/app");
  };

  const handleGoToBilling = () => {
    router.push("/app/billing");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-3xl bg-background/50">
      <div className="min-h-screen   top-0  left-0 right-0 flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="text-center">
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <CheckCircle className="h-16 w-16 text-green-500" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isRefreshing ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">
                    Updating your account...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Thank you for your payment! Your account has been updated
                    successfully.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleGoToDashboard}
                      className="flex-1"
                      variant="outline"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                    <Button onClick={handleGoToBilling} className="flex-1">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Manage Billing
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
