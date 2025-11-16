"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const competitors = [
  {
    id: "competitor1",
    name: "Competitor A",
    logo: "/placeholder.svg?height=50&width=150&text=Competitor+A",
  },
  {
    id: "competitor2",
    name: "Competitor B",
    logo: "/placeholder.svg?height=50&width=150&text=Competitor+B",
  },
  {
    id: "competitor3",
    name: "Competitor C",
    logo: "/placeholder.svg?height=50&width=150&text=Competitor+C",
  },
];

export default function ComparisonHero() {
  const [selectedCompetitor, setSelectedCompetitor] = useState("competitor1");

  const keyDifferences = {
    competitor1: [
      { feature: "Automation Capabilities", saasify: true, competitor: false },
      { feature: "Custom Workflows", saasify: true, competitor: false },
      { feature: "24/7 Support", saasify: true, competitor: true },
      { feature: "Data Analytics", saasify: true, competitor: false },
      { feature: "Third-party Integrations", saasify: true, competitor: true },
    ],
    competitor2: [
      { feature: "Automation Capabilities", saasify: true, competitor: true },
      { feature: "Custom Workflows", saasify: true, competitor: false },
      { feature: "24/7 Support", saasify: true, competitor: false },
      { feature: "Data Analytics", saasify: true, competitor: true },
      { feature: "Third-party Integrations", saasify: true, competitor: false },
    ],
    competitor3: [
      { feature: "Automation Capabilities", saasify: true, competitor: true },
      { feature: "Custom Workflows", saasify: true, competitor: true },
      { feature: "24/7 Support", saasify: true, competitor: false },
      { feature: "Data Analytics", saasify: true, competitor: false },
      { feature: "Third-party Integrations", saasify: true, competitor: true },
    ],
  };

  return (
    <section className="bg-gradient-to-b flex flex-col items-center from-muted/50 to-background pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              Transparent Comparison
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              SaaSify vs.
              <br />
              The Competition
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              See how SaaSify stacks up against other leading solutions in the
              market with our feature-by-feature comparison.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="#pricing-comparison">
                <Button size="lg">Compare Pricing</Button>
              </Link>
              <Link href="#feature-comparison">
                <Button variant="outline" size="lg">
                  Compare Features
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="bg-background rounded-xl border shadow-lg p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium mb-4">Key Differences</h3>

            <Tabs
              defaultValue="competitor1"
              value={selectedCompetitor}
              onValueChange={setSelectedCompetitor}
            >
              <TabsList className="w-full mb-6">
                {competitors.map((competitor) => (
                  <TabsTrigger
                    key={competitor.id}
                    value={competitor.id}
                    className="flex-1"
                  >
                    <Image
                      src={competitor.logo || "/placeholder.svg"}
                      alt={competitor.name}
                      width={100}
                      height={25}
                      className="h-6 w-auto object-contain"
                    />
                  </TabsTrigger>
                ))}
              </TabsList>

              {competitors.map((competitor) => (
                <TabsContent
                  key={competitor.id}
                  value={competitor.id}
                  className="mt-0"
                >
                  <div className="grid grid-cols-[1fr_auto_auto] gap-y-3 gap-x-4">
                    <div className="font-medium">Feature</div>
                    <div className="font-medium text-center">SaaSify</div>
                    <div className="font-medium text-center">
                      {competitor.name}
                    </div>

                    {keyDifferences[
                      competitor.id as keyof typeof keyDifferences
                    ].map((diff, idx) => (
                      <>
                        <div key={`feature-${idx}`} className="py-2 border-t">
                          {diff.feature}
                        </div>
                        <div
                          key={`saasify-${idx}`}
                          className="py-2 border-t flex justify-center"
                        >
                          <Check className="text-green-500 h-5 w-5" />
                        </div>
                        <div
                          key={`competitor-${idx}`}
                          className="py-2 border-t flex justify-center"
                        >
                          {diff.competitor ? (
                            <Check className="text-green-500 h-5 w-5" />
                          ) : (
                            <X className="text-red-500 h-5 w-5" />
                          )}
                        </div>
                      </>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 text-center">
              <Link href="/demo">
                <Button variant="link" className="group">
                  Request a personalized comparison
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Logos section */}
        <div className="mt-16 md:mt-24 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Thousands of companies have switched from these providers to SaaSify
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <Image
                  src={`/placeholder.svg?height=30&width=120&text=Company+${i}`}
                  alt={`Company ${i}`}
                  width={120}
                  height={30}
                  className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
