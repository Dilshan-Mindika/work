"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  distance?: number;
  rotate?: number;
}

export function FloatingElement({
  children,
  className = "",
  duration = 3,
  delay = 0,
  distance = 10,
  rotate = 0,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{
        y: [0, -distance, 0],
        rotate: rotate ? [0, rotate, 0] : undefined,
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

interface FloatingGroupProps {
  children?: ReactNode;
  className?: string;
  count?: number;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
  colors?: string[];
}

export function FloatingGroup({
  children,
  className = "",
  count = 10,
  minSize = 5,
  maxSize = 20,
  minDuration = 10,
  maxDuration = 25,
  colors = ["bg-primary/10", "bg-secondary/10", "bg-accent/10"],
}: FloatingGroupProps) {
  const items = Array.from({ length: count }).map((_, i) => {
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    const duration =
      Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
    const delay = Math.random() * 5;
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;

    return (
      <motion.div
        key={i}
        className={`absolute rounded-full ${colorClass}`}
        style={{
          width: size,
          height: size,
          left,
          top,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() > 0.5 ? 20 : -20, 0],
        }}
        transition={{
          duration,
          delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
    );
  });

  return (
    <div className={`relative ${className}`}>
      {items}
      {children}
    </div>
  );
}
