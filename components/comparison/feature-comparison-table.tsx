"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Feature category data
const featureCategories = [
  {
    id: "core",
    name: "Core Features",
    features: [
      {
        name: "Dashboard & Analytics",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: true,
        tooltip: "Comprehensive dashboards for monitoring key metrics",
      },
      {
        name: "Advanced Reporting",
        saasify: true,
        competitorA: true,
        competitorB: { limited: true, note: "Basic reports only" },
        competitorC: { limited: true, note: "Limited customization" },
        tooltip: "Detailed customizable reports with export options",
      },
      {
        name: "Custom Workflows",
        saasify: true,
        competitorA: { limited: true, note: "Enterprise plan only" },
        competitorB: false,
        competitorC: false,
        tooltip: "Create automated workflows with drag-and-drop simplicity",
      },
      {
        name: "User Management",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: { limited: true, note: "Basic controls only" },
        tooltip: "Comprehensive user roles and permission settings",
      },
      {
        name: "Activity Tracking",
        saasify: true,
        competitorA: true,
        competitorB: { limited: true, note: "Limited history" },
        competitorC: true,
        tooltip: "Full audit trails and activity logs for all users",
      },
    ],
  },
  {
    id: "automation",
    name: "Automation & AI",
    features: [
      {
        name: "Task Automation",
        saasify: true,
        competitorA: true,
        competitorB: { limited: true, note: "Basic automation only" },
        competitorC: false,
        tooltip: "Automate repetitive tasks without coding",
      },
      {
        name: "AI Recommendations",
        saasify: true,
        competitorA: false,
        competitorB: false,
        competitorC: { limited: true, note: "Beta feature" },
        tooltip: "Smart suggestions based on your usage patterns",
      },
      {
        name: "Predictive Analytics",
        saasify: true,
        competitorA: { limited: true, note: "Enterprise plan only" },
        competitorB: false,
        competitorC: false,
        tooltip: "Forecast trends based on historical data",
      },
      {
        name: "Smart Alerts",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: false,
        tooltip: "Intelligent notifications based on custom thresholds",
      },
    ],
  },
  {
    id: "integration",
    name: "Integrations & API",
    features: [
      {
        name: "Third-party Integrations",
        saasify: { count: "200+" },
        competitorA: { count: "100+" },
        competitorB: { count: "50+" },
        competitorC: { count: "20+" },
        tooltip: "Connect with your favorite tools and services",
      },
      {
        name: "Open API",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: { limited: true, note: "Limited endpoints" },
        tooltip: "Comprehensive API for custom integrations",
      },
      {
        name: "Webhooks",
        saasify: true,
        competitorA: true,
        competitorB: { limited: true, note: "Basic triggers only" },
        competitorC: false,
        tooltip: "Configure triggers for real-time data syncing",
      },
      {
        name: "Import/Export Tools",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: { limited: true, note: "CSV only" },
        tooltip: "Easily migrate data in and out with various formats",
      },
    ],
  },
  {
    id: "security",
    name: "Security & Compliance",
    features: [
      {
        name: "Single Sign-On (SSO)",
        saasify: true,
        competitorA: true,
        competitorB: { limited: true, note: "Enterprise plan only" },
        competitorC: false,
        tooltip: "Secure authentication with your identity provider",
      },
      {
        name: "Two-Factor Authentication",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: false,
        tooltip: "Additional security layer for user accounts",
      },
      {
        name: "GDPR Compliance",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: { limited: true, note: "Partial" },
        tooltip: "Tools and processes for data protection compliance",
      },
      {
        name: "Data Encryption",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: true,
        tooltip: "End-to-end encryption for all your data",
      },
    ],
  },
  {
    id: "support",
    name: "Support & Resources",
    features: [
      {
        name: "24/7 Support",
        saasify: true,
        competitorA: { limited: true, note: "Enterprise plan only" },
        competitorB: false,
        competitorC: false,
        tooltip: "Round-the-clock assistance whenever you need it",
      },
      {
        name: "Dedicated Account Manager",
        saasify: { limited: true, note: "Business & Enterprise plans" },
        competitorA: { limited: true, note: "Enterprise plan only" },
        competitorB: { limited: true, note: "Enterprise plan only" },
        competitorC: false,
        tooltip: "Personalized guidance for your organization",
      },
      {
        name: "Training Resources",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: { limited: true, note: "Basic documentation" },
        tooltip: "Comprehensive learning materials and tutorials",
      },
      {
        name: "Community Forum",
        saasify: true,
        competitorA: true,
        competitorB: true,
        competitorC: true,
        tooltip: "Connect with other users and share insights",
      },
    ],
  },
];

export default function FeatureComparisonTable() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "core",
  ]);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(
        expandedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const expandAll = () => {
    setExpandedCategories(featureCategories.map((category) => category.id));
  };

  const collapseAll = () => {
    setExpandedCategories([]);
  };

  // Custom rendering for feature status
  const renderFeatureStatus = (status: any) => {
    if (status === true) {
      return <Check className="text-green-500 h-5 w-5 mx-auto" />;
    } else if (status === false) {
      return <X className="text-red-500 h-5 w-5 mx-auto" />;
    } else if (status && status.limited) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className="text-yellow-500 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50"
                >
                  Limited
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{status.note}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (status && status.count) {
      return <span className="text-sm font-medium">{status.count}</span>;
    }
    return null;
  };

  return (
    <div
      id="feature-comparison"
      className="scroll-mt-24 flex flex-col items-center mt-10"
    >
      <div className="flex justify-end mb-4 space-x-2">
        <Button variant="outline" size="sm" onClick={expandAll}>
          Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          Collapse All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-4 min-w-[200px]">Feature</th>
              <th className="p-4 text-center min-w-[120px] border-l border-border">
                <div className="font-bold">SaaSify</div>
                <Badge className="mt-1 bg-primary">Our Solution</Badge>
              </th>
              <th className="p-4 text-center min-w-[120px] border-l border-border">
                Competitor A
              </th>
              <th className="p-4 text-center min-w-[120px] border-l border-border">
                Competitor B
              </th>
              <th className="p-4 text-center min-w-[120px] border-l border-border">
                Competitor C
              </th>
            </tr>
          </thead>
          <tbody>
            {featureCategories.map((category) => (
              <motion.tr
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td colSpan={5} className="border-t border-border p-0">
                  <Accordion
                    type="single"
                    value={
                      expandedCategories.includes(category.id)
                        ? category.id
                        : ""
                    }
                    onValueChange={(value) => {
                      if (value) {
                        setExpandedCategories([
                          ...expandedCategories.filter(
                            (id) => id !== category.id
                          ),
                          category.id,
                        ]);
                      } else {
                        setExpandedCategories(
                          expandedCategories.filter((id) => id !== category.id)
                        );
                      }
                    }}
                  >
                    <AccordionItem value={category.id} className="border-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                        <h3 className="text-base font-medium">
                          {category.name}
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 pb-0">
                        {category.features.map((feature, index) => (
                          <div
                            key={feature.name}
                            className={`grid grid-cols-5 ${
                              index !== 0 ? "border-t border-border" : ""
                            }`}
                          >
                            <div className="col-span-1 p-4 flex items-center">
                              <div>
                                <div className="flex items-center">
                                  {feature.name}
                                  {feature.tooltip && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{feature.tooltip}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-1 p-4 border-l border-border">
                              {renderFeatureStatus(feature.saasify)}
                            </div>
                            <div className="col-span-1 p-4 border-l border-border">
                              {renderFeatureStatus(feature.competitorA)}
                            </div>
                            <div className="col-span-1 p-4 border-l border-border">
                              {renderFeatureStatus(feature.competitorB)}
                            </div>
                            <div className="col-span-1 p-4 border-l border-border">
                              {renderFeatureStatus(feature.competitorC)}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
