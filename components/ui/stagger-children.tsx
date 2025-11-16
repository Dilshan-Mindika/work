"use client";

import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StaggerChildrenProps {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
  staggerDirection?: "forward" | "reverse";
}

export function StaggerChildren({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = "",
  once = true,
  staggerDirection = "forward",
}: StaggerChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
        staggerDirection: staggerDirection === "reverse" ? -1 : 1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  distance?: number;
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
  duration = 0.5,
  distance = 50,
}: StaggerItemProps) {
  const getDirection = () => {
    switch (direction) {
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      case "up":
      default:
        return { y: distance };
    }
  };

  const item = {
    hidden: { opacity: 0, ...getDirection() },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
