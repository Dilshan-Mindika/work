"use client";

import type React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Star, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPlans } from "@/lib/config/pricing";
import CheckoutButton from "@/components/buttons/checkout-button";
import { useAppContext } from "@/context/app";

// Mock data for demonstration

// Mock checkout button component

export default function Pricing({
  className,
  onlyPricingCard,
}: {
  className?: string;
  onlyPricingCard?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { billing } = useAppContext();
  return (
    <section
      id="pricing"
      className={cn(
        "py-16 bg-gradient-to-br from-background via-background to-muted/20",
        className
      )}
      ref={ref}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        {!onlyPricingCard && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-1.5 bg-primary/10 rounded-full mb-4">
              <span className="text-primary text-xs font-medium px-2 py-0.5 bg-primary/10 rounded-full">
                Pricing Plans
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Simple, transparent pricing that scales with your business. Start
              free and upgrade as you grow.
            </p>
          </motion.div>
        )}

        {/* Pricing Cards Grid */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4">
            {PricingPlans.map((plan, index) => {
              return (
                <motion.div
                  key={index}
                  className={cn(
                    "relative group",
                    plan.popular && "lg:scale-105 z-10"
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
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold py-1 px-4 rounded-full shadow-lg border border-primary/20">
                        <span className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Most Popular
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={cn(
                      "relative h-full bg-card/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300",
                      "border border-border/50 shadow-lg hover:shadow-2xl",
                      "group-hover:border-primary/30 group-hover:-translate-y-1",
                      plan.popular &&
                        "border-primary/30 bg-gradient-to-br from-card to-primary/5"
                    )}
                  >
                    {/* Plan header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-3xl font-bold text-foreground">
                          {plan.currencySymbol}
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground text-sm font-medium">
                          /{plan.billingCycle}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Billed {plan.billingCycle}ly
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6 flex-grow">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={`${plan.id}-feature-${idx}`}
                            className="flex items-start gap-2 group/feature"
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
                      disabled={plan.id === billing?.details.id}
                      mode={plan.type}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200",
                        "hover:scale-105 hover:shadow-lg active:scale-95",
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                          : "bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-primary/30"
                      )}
                    >
                      {plan.trial
                        ? `Free Trial (${plan.trial} days)`
                        : plan.displayButtonName}
                    </CheckoutButton>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
