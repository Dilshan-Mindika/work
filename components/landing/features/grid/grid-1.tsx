"use client";

import {
  BarChart,
  Clock,
  Cloud,
  Code,
  Cog,
  Database,
  Globe,
  Lock,
  MessageSquare,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { StaggerChildren, StaggerItem } from "@/components/ui/stagger-children";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Advanced Analytics",
      description:
        "Gain deep insights with customizable dashboards and reports.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Workflow Automation",
      description:
        "Automate repetitive tasks with our visual workflow builder.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with integrated communication tools.",
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Cloud Infrastructure",
      description: "Reliable, scalable hosting with 99.9% uptime guarantee.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Developer API",
      description: "Extend functionality with our comprehensive API.",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Protect your data with bank-level encryption and controls.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Accessibility",
      description: "Access your data from anywhere, on any device.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Management",
      description: "Organize and manage your data with powerful tools.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Customer Support",
      description: "Get help when you need it with 24/7 customer support.",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Apps",
      description: "Stay productive on the go with our mobile applications.",
    },
    {
      icon: <Cog className="h-6 w-6" />,
      title: "Customization",
      description: "Tailor the platform to your specific business needs.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Performance",
      description: "Lightning-fast performance even with large datasets.",
    },
  ];

  return (
    <section className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container flex flex-col text-center items-center px-4 md:px-6">
        <div className="flex flex-col items-center text-center  space-y-4">
          <div className="space-y-2 flex flex-col items-center">
            <Reveal>
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Feature Rich
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything You Need in One Place
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Our comprehensive platform provides all the tools you need to
                run and grow your business.
              </p>
            </Reveal>
          </div>
        </div>
        <StaggerChildren className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="flex flex-col items-center rounded-lg border bg-background p-4 text-center shadow-sm transition-all hover:shadow-md"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="mb-1 text-lg font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
