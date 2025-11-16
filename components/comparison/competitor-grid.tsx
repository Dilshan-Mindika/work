"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const competitors = [
  {
    id: "competitor-a",
    name: "Competitor A",
    logo: "/placeholder.svg?height=80&width=200&text=Competitor+A",
    description:
      "A well-established player focusing on enterprise solutions with complex setup requirements.",
    strengths: [
      "Enterprise features",
      "Market longevity",
      "Large customer base",
    ],
    weaknesses: ["Complex UI", "Expensive", "Slow support response"],
    pricing: "$$$$",
    targetAudience: "Enterprise",
    highlight: false,
  },
  {
    id: "competitor-b",
    name: "Competitor B",
    logo: "/placeholder.svg?height=80&width=200&text=Competitor+B",
    description:
      "A mid-market solution with good features but limited scalability for growing businesses.",
    strengths: ["Simple interface", "Good documentation", "Active community"],
    weaknesses: ["Limited customization", "Scaling issues", "Few integrations"],
    pricing: "$$$",
    highlight: false,
  },
  {
    id: "competitor-c",
    name: "Competitor C",
    logo: "/placeholder.svg?height=80&width=200&text=Competitor+C",
    description:
      "A newer entrant with modern features but lacks the comprehensive solution SaaSify offers.",
    strengths: ["Modern UI", "Good API", "Regular updates"],
    weaknesses: ["Limited features", "Reliability issues", "Small ecosystem"],
    highlight: false,
  },
];

export default function CompetitorGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-screen-xl">
      {competitors.map((competitor, index) => (
        <motion.div
          key={competitor.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card
            className={`h-full ${
              competitor.highlight ? "border-primary shadow-lg" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 relative">
                  <Image
                    src={competitor.logo || "/placeholder.svg"}
                    alt={competitor.name}
                    width={160}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                {competitor.highlight && (
                  <Badge className="bg-primary">Our Solution</Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {competitor.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Target Market</h4>
                  <Badge variant="outline">{competitor.targetAudience}</Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Price Range</h4>
                  <div className="text-sm font-mono">{competitor.pricing}</div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Key Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-1.5 py-0.5 rounded mr-2">
                          +
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {competitor.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Limitations</h4>
                    <ul className="text-sm space-y-1">
                      {competitor.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs px-1.5 py-0.5 rounded mr-2">
                            -
                          </span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
