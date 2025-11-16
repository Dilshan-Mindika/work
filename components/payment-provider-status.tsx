"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface PaymentProviderStatus {
  stripe: {
    configured: boolean;
    error?: string;
  };
  lemonsqueezy: {
    configured: boolean;
    error?: string;
  };
  webxpay: {
    configured: boolean;
    error?: string;
  };
}

export function PaymentProviderStatus() {
  const [status, setStatus] = useState<PaymentProviderStatus>({
    stripe: { configured: false },
    lemonsqueezy: { configured: false },
    webxpay: { configured: false },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/payment-status");
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to check payment provider status:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Checking payment providers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Stripe Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Stripe
          </CardTitle>
          <Badge variant={status.stripe.configured ? "default" : "destructive"}>
            {status.stripe.configured ? "Configured" : "Not Configured"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {status.stripe.configured ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {status.stripe.configured
                ? "Ready to process payments"
                : status.stripe.error || "Missing configuration"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lemon Squeezy Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Lemon Squeezy
          </CardTitle>
          <Badge
            variant={status.lemonsqueezy.configured ? "default" : "destructive"}
          >
            {status.lemonsqueezy.configured ? "Configured" : "Not Configured"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {status.lemonsqueezy.configured ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {status.lemonsqueezy.configured
                ? "Ready to process payments"
                : status.lemonsqueezy.error || "Missing configuration"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* WebXPay Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            WebXPay
          </CardTitle>
          <Badge variant={status.webxpay.configured ? "default" : "destructive"}>
            {status.webxpay.configured ? "Configured" : "Not Configured"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {status.webxpay.configured ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {status.webxpay.configured
                ? "Ready to process payments"
                : status.webxpay.error || "Missing configuration"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Help */}
      {(!status.stripe.configured || !status.lemonsqueezy.configured || !status.webxpay.configured) && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Configuration Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              To enable payment processing, you need to configure at least one
              payment provider.
            </p>
            <div className="space-y-2">
              {!status.stripe.configured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stripe Configuration</span>
                  <Button variant="outline" size="sm">
                    Configure Stripe
                  </Button>
                </div>
              )}
              {!status.lemonsqueezy.configured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lemon Squeezy Configuration</span>
                  <Button variant="outline" size="sm">
                    Configure Lemon Squeezy
                  </Button>
                </div>
              )}
              {!status.webxpay.configured && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">WebXPay Configuration</span>
                  <Button variant="outline" size="sm">
                    Configure WebXPay
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
