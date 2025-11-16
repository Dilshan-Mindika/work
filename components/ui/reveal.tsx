"use client";

import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  once?: boolean;
  distance?: number;
}

export function Reveal({
  children,
  width = "fit-content",
  delay = 0,
  duration = 0.5,
  direction = "up",
  className = "",
  once = true,
  distance = 75,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

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

  const from = {
    opacity: 0,
    ...getDirection(),
  };

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        variants={{
          hidden: { ...from },
          visible: { opacity: 1, x: 0, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier easing
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  direction?: "up" | "down" | "left" | "right";
}

export function MaskReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  once = true,
  direction = "up",
}: MaskRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const getDirection = () => {
    switch (direction) {
      case "down":
        return { y: "-100%" };
      case "left":
        return { x: "100%" };
      case "right":
        return { x: "-100%" };
      case "up":
      default:
        return { y: "100%" };
    }
  };

  const from = getDirection();

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ ...from }}
        animate={isInView ? { x: 0, y: 0 } : { ...from }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
