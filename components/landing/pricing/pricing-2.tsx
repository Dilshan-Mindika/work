"use client";

import type React from "react";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Star, Zap, Crown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPlans } from "@/lib/config/pricing";

// Mock checkout button component
function CheckoutButton({
  children,
  className,
  disabled,
  priceId,
  variantId,
  mode,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  priceId?: string;
  variantId?: string;
  mode?: string;
}) {
  const handleCheckout = async () => {
    try {
      // Handle different checkout scenarios
      if (mode === "subscription") {
        // For subscription plans
        console.log("Processing subscription:", { priceId, variantId, mode });

        if (variantId) {
          // Redirect to Lemon Squeezy checkout
          const checkoutUrl = `https://app.lemonsqueezy.com/checkout/buy/${variantId}`;
          window.open(checkoutUrl, "_blank");
        } else {
          alert("Subscription plan selected. Redirecting to checkout...");
        }
        return;
      }

      if (mode === "payment") {
        // For one-time payment plans
        console.log("Processing one-time payment:", {
          priceId,
          variantId,
          mode,
        });

        if (variantId) {
          // Redirect to Lemon Squeezy checkout
          const checkoutUrl = `https://app.lemonsqueezy.com/checkout/buy/${variantId}`;
          window.open(checkoutUrl, "_blank");
        } else {
          alert("One-time payment plan selected. Redirecting to checkout...");
        }
        return;
      }

      // Fallback for plans without specific IDs
      console.log("Checkout clicked for plan:", mode);
      alert(`Starting checkout for ${mode} plan...`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your checkout. Please try again.");
    }
  };

  return (
    <button
      className={cn(
        "w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled}
      onClick={handleCheckout}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Pricing2({
  className,
}: {
  className?: string;
  onlyPricingCard?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <section
      id="pricing"
      className={cn(
        "py-24 bg-gradient-to-br from-background via-background to-muted/20",
        className
      )}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
            <span className="text-primary text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
              Pricing Plans
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the perfect plan for your business. All plans include our
            core features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className={cn(
                "relative w-16 h-8 rounded-full transition-all duration-300",
                billingCycle === "yearly" ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md",
                  billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "yearly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Yearly
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PricingPlans.map((plan, index) => {
              const isPopular = plan.popular;
              const price =
                billingCycle === "yearly"
                  ? Math.round(Number(plan.price) * 0.8)
                  : plan.price;

              return (
                <motion.div
                  key={plan.id}
                  className={cn(
                    "relative group",
                    isPopular && "lg:scale-105 z-10"
                  )}
                  initial={{ opacity: 0, y: 40 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold py-1.5 px-4 rounded-full shadow-lg border border-primary/20">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Most Popular
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={cn(
                      "relative h-full bg-card/50 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300",
                      "border border-border/50 shadow-lg hover:shadow-2xl",
                      "group-hover:border-primary/30 group-hover:-translate-y-1",
                      isPopular &&
                        "border-primary/30 bg-gradient-to-br from-card to-primary/5"
                    )}
                  >
                    {/* Plan header */}
                    <div className="text-center mb-6">
                      <div
                        className={cn(
                          "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                          isPopular
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isPopular ? (
                          <Crown className="w-6 h-6" />
                        ) : plan.name === "Starter" ? (
                          <Zap className="w-6 h-6" />
                        ) : (
                          <Star className="w-6 h-6" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-2 mb-1">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.currencySymbol}
                          {price}
                        </span>
                        <span className="text-muted-foreground font-medium text-sm">
                          /{billingCycle === "yearly" ? "year" : "month"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {billingCycle === "yearly"
                          ? "Billed annually"
                          : "Billed monthly"}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6 flex-grow">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={`${plan.id}-feature-${idx}`}
                            className="flex items-start gap-3 group/feature"
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5",
                                feature.active
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {feature.active ? (
                                <Check className="w-2.5 h-2.5" />
                              ) : (
                                <X className="w-2.5 h-2.5" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-xs leading-relaxed transition-colors",
                                feature.active
                                  ? "text-foreground group-hover/feature:text-primary"
                                  : "text-muted-foreground line-through"
                              )}
                            >
                              {feature.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <CheckoutButton
                      priceId={plan.priceId}
                      variantId={plan.variantId}
                      mode={plan.type}
                      disabled={false}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200",
                        "hover:scale-105 hover:shadow-lg active:scale-95",
                        "flex items-center justify-center gap-2",
                        isPopular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                          : "bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/30"
                      )}
                    >
                      {plan.displayButtonName}
                      <ArrowRight className="w-4 h-4" />
                    </CheckoutButton>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-muted-foreground mb-4">Need a custom solution?</p>
          <button className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Contact our sales team →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
