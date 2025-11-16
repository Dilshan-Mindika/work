"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  from,
  to,
  duration = 1.5,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });

  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
    stiffness: 80,
    damping: 15,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(to);
    }
  }, [inView, motionValue, to]);

  useEffect(() => {
    if (!nodeRef.current) return;

    const unsubscribe = springValue.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${latest.toFixed(
          decimals
        )}${suffix}`;
      }
    });

    return unsubscribe;
  }, [springValue, prefix, suffix, decimals]);

  return (
    <span ref={nodeRef} className={className}>
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </span>
  );
}
