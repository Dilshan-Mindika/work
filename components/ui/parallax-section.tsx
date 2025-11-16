"use client";

import { type ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
  springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 1,
  },
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const transformRange =
    direction === "down"
      ? [0, speed * 100]
      : direction === "left"
      ? [0, speed * -100]
      : direction === "right"
      ? [0, speed * 100]
      : [0, speed * -100];

  const transform = useTransform(scrollYProgress, [0, 1], transformRange);
  const springTransform = useSpring(transform, springConfig);

  const getMotionProps = () => {
    switch (direction) {
      case "left":
      case "right":
        return { x: springTransform };
      case "up":
      case "down":
      default:
        return { y: springTransform };
    }
  };

  return (
    <motion.section ref={ref} className={className} style={getMotionProps()}>
      {children}
    </motion.section>
  );
}

interface ParallaxLayerProps {
  children?: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function ParallaxLayer({
  children,
  className = "",
  speed = 0.2,
  direction = "up",
}: ParallaxLayerProps) {
  const { scrollY } = useScroll();

  const transformValue =
    direction === "down"
      ? (value: number) => value * speed
      : direction === "left"
      ? (value: number) => value * -speed
      : direction === "right"
      ? (value: number) => value * speed
      : (value: number) => value * -speed;

  const transform = useTransform(scrollY, transformValue);
  const springTransform = useSpring(transform, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const getMotionProps = () => {
    switch (direction) {
      case "left":
      case "right":
        return { x: springTransform };
      case "up":
      case "down":
      default:
        return { y: springTransform };
    }
  };

  return (
    <motion.div className={className} style={getMotionProps()}>
      {children}
    </motion.div>
  );
}
