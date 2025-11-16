"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const pricingPlans = [
  {
    tier: "Starter",
    saasify: {
      price: "$29",
      userLimit: "Up to 5",
      storage: "10GB",
      features: ["Basic Reports", "Email Support", "API Access (Limited)"],
    },
    competitorA: {
      price: "$39",
      userLimit: "Up to 3",
      storage: "5GB",
      features: ["Basic Reports", "Email Support"],
    },
    competitorB: {
      price: "$25",
      userLimit: "Up to 3",
      storage: "5GB",
      features: ["Limited Reports", "Community Support"],
    },
    competitorC: {
      price: "$19",
      userLimit: "Up to 2",
      storage: "2GB",
      features: ["No Reports", "Email Support"],
    },
  },
  {
    tier: "Professional",
    saasify: {
      price: "$79",
      userLimit: "Up to 20",
      storage: "50GB",
      features: [
        "Advanced Reports",
        "Priority Support",
        "Full API Access",
        "Custom Workflows",
      ],
    },
    competitorA: {
      price: "$99",
      userLimit: "Up to 10",
      storage: "25GB",
      features: ["Advanced Reports", "Priority Support", "Basic API Access"],
    },
    competitorB: {
      price: "$75",
      userLimit: "Up to 10",
      storage: "25GB",
      features: ["Basic Reports", "Email Support", "Basic API Access"],
    },
    competitorC: {
      price: "$49",
      userLimit: "Up to 5",
      storage: "10GB",
      features: ["Basic Reports", "Email Support"],
    },
  },
  {
    tier: "Business",
    saasify: {
      price: "$199",
      userLimit: "Up to 50",
      storage: "250GB",
      features: [
        "Custom Reports",
        "24/7 Support",
        "Full API Access",
        "Custom Workflows",
        "Dedicated Account Manager",
      ],
    },
    competitorA: {
      price: "$299",
      userLimit: "Up to 30",
      storage: "100GB",
      features: [
        "Custom Reports",
        "Priority Support",
        "Full API Access",
        "Limited Custom Workflows",
      ],
    },
    competitorB: {
      price: "$199",
      userLimit: "Up to 25",
      storage: "50GB",
      features: ["Advanced Reports", "Priority Support", "Full API Access"],
    },
    competitorC: {
      price: "$129",
      userLimit: "Up to 15",
      storage: "25GB",
      features: ["Basic Reports", "Priority Support", "Basic API Access"],
    },
  },
  {
    tier: "Enterprise",
    saasify: {
      price: "Custom",
      userLimit: "Unlimited",
      storage: "Unlimited",
      features: [
        "Everything in Business",
        "Custom Development",
        "SLA",
        "On-premises Option",
      ],
    },
    competitorA: {
      price: "Custom",
      userLimit: "Unlimited",
      storage: "Unlimited",
      features: ["Everything in Business", "Custom Development", "SLA"],
    },
    competitorB: {
      price: "Custom",
      userLimit: "Up to 100",
      storage: "250GB",
      features: [
        "Custom Reports",
        "24/7 Support",
        "Full API Access",
        "Limited Custom Workflows",
      ],
    },
    competitorC: {
      price: "$299",
      userLimit: "Up to 30",
      storage: "100GB",
      features: ["Advanced Reports", "Priority Support", "Full API Access"],
    },
  },
];

export default function PricingComparisonTable() {
  return (
    <div
      id="pricing-comparison"
      className="scroll-mt-24 flex flex-col items-center"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>
            All prices shown are per month, billed annually
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Tier</TableHead>
              <TableHead className="text-center min-w-[200px]">
                <div className="flex justify-center items-center space-x-2">
                  <span className="font-bold">SaaSify</span>
                  <Badge className="bg-primary">Best Value</Badge>
                </div>
              </TableHead>
              <TableHead className="text-center min-w-[200px]">
                Competitor A
              </TableHead>
              <TableHead className="text-center min-w-[200px]">
                Competitor B
              </TableHead>
              <TableHead className="text-center min-w-[200px]">
                Competitor C
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingPlans.map((plan, index) => (
              <motion.tr
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={index % 2 === 0 ? "bg-muted/50" : ""}
              >
                <TableCell className="font-medium">{plan.tier}</TableCell>
                <TableCell>
                  <PricingCell data={plan.saasify} highlight />
                </TableCell>
                <TableCell>
                  <PricingCell data={plan.competitorA} />
                </TableCell>
                <TableCell>
                  <PricingCell data={plan.competitorB} />
                </TableCell>
                <TableCell>
                  <PricingCell data={plan.competitorC} />
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PricingCell({
  data,
  highlight = false,
}: {
  data: any;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-md ${
        highlight ? "bg-primary/5 border border-primary/20" : ""
      }`}
    >
      <div className="text-2xl font-bold text-center mb-3">{data.price}</div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Users:</span>
          <span className="font-medium">{data.userLimit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Storage:</span>
          <span className="font-medium">{data.storage}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="text-sm font-medium mb-2">Features:</div>
        {data.features.map((feature: string, i: number) => (
          <div key={i} className="flex items-center text-sm">
            <div className="min-w-4 mr-2">
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
