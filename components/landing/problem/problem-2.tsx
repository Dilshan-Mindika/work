"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { StaggerChildren, StaggerItem } from "@/components/ui/stagger-children";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default function Problem2() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-primary/5"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 h-60 w-60 rounded-full bg-secondary/5"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Reveal>
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                The Problem
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Business Challenges in Today's Digital Landscape
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Companies are struggling with fragmented tools, inefficient
                processes, and scaling issues.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <StaggerChildren className="flex flex-col justify-center space-y-4">
            <StaggerItem>
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Fragmented Tools</h3>
                  <p className="text-muted-foreground">
                    Using multiple disconnected tools leads to data silos,
                    inconsistencies, and wasted time switching between
                    platforms.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Manual Processes</h3>
                  <p className="text-muted-foreground">
                    Repetitive tasks consume valuable time that could be spent
                    on strategic initiatives and growth.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Scaling Difficulties</h3>
                  <p className="text-muted-foreground">
                    As your business grows, existing systems often break down,
                    creating bottlenecks and limiting expansion.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <StaggerChildren
            className="flex flex-col justify-center space-y-4"
            delay={0.3}
          >
            <StaggerItem>
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">SaaSify Solution</h3>
                  <p className="text-muted-foreground">
                    Our unified platform eliminates tool fragmentation, bringing
                    everything you need into one seamless experience.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Automation Power</h3>
                  <p className="text-muted-foreground">
                    Automate repetitive tasks and workflows, freeing your team
                    to focus on what truly matters.
                  </p>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">Built to Scale</h3>
                  <p className="text-muted-foreground">
                    Our platform grows with you, handling increased workloads
                    without performance degradation.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>

        {/* Stats section with animated counters */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
            <AnimatedCounter
              from={0}
              to={85}
              suffix="%"
              className="text-3xl md:text-4xl font-bold text-primary block"
            />
            <span className="text-sm text-muted-foreground">Time Saved</span>
          </div>
          <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
            <AnimatedCounter
              from={0}
              to={40}
              suffix="%"
              className="text-3xl md:text-4xl font-bold text-primary block"
            />
            <span className="text-sm text-muted-foreground">
              Cost Reduction
            </span>
          </div>
          <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
            <AnimatedCounter
              from={0}
              to={10000}
              suffix="+"
              className="text-3xl md:text-4xl font-bold text-primary block"
            />
            <span className="text-sm text-muted-foreground">Happy Users</span>
          </div>
          <div className="p-4 rounded-lg bg-background/50 backdrop-blur-sm">
            <AnimatedCounter
              from={0}
              to={99.9}
              suffix="%"
              className="text-3xl md:text-4xl font-bold text-primary block"
            />
            <span className="text-sm text-muted-foreground">Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
