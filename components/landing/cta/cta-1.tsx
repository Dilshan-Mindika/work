"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxSection } from "@/components/ui/parallax-section";

export default function CTA() {
  return (
    <ParallaxSection className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-[50px]"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-white/5 blur-[50px]"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl">
                Ready to Transform Your Business?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl/relaxed">
                Join thousands of companies that are already saving time,
                reducing costs, and growing faster with SaaSify.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#pricing">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="secondary" className="gap-1 group">
                    Get Started
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              <Link href="#demo">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                  >
                    Book a Demo
                  </Button>
                </motion.div>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-6">
              <p className="text-sm text-primary-foreground/60">
                No credit card required. 14-day free trial. Cancel anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </ParallaxSection>
  );
}
