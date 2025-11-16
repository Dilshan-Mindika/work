"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { MaskReveal } from "./reveal";

interface TextAnimationProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  once?: boolean;
  type?: "chars" | "words" | "lines";
}

export function TextAnimation({
  text,
  className = "",
  delay = 0,
  duration = 0.05,
  staggerChildren = 0.03,
  once = true,
  type = "words",
}: TextAnimationProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const getItems = () => {
    switch (type) {
      case "chars":
        return text.split("");
      case "lines":
        return text.split("\n");
      case "words":
      default:
        return text.split(" ");
    }
  };

  const items = getItems();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration,
      },
    },
  };

  return (
    <div ref={ref} className={className}>
      <motion.div variants={container} initial="hidden" animate={controls}>
        {items.map((item, index) => (
          <motion.span
            key={index}
            variants={child}
            style={{
              display: "inline-block",
              marginRight: type === "words" ? "0.25em" : undefined,
            }}
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
  animate?: boolean;
  duration?: number;
}

export function GradientText({
  children,
  className = "",
  from = "from-primary",
  to = "to-secondary",
  animate = true,
  duration = 3,
}: GradientTextProps) {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-gradient-to-r ${from} ${to} ${className}`}
      animate={
        animate
          ? {
              backgroundPosition: ["0% center", "100% center"],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}

// Main Component
const LandingPage = () => {
  return (
    <div className="container" style={{ opacity: 1 }}>
      <div className="grid gap-6">
        <motion.div
          className="flex flex-..."
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex flex-..." style={{ opacity: 0 }}>
            <div className="space-y-2">
              <MaskReveal>
                <MaskReveal>
                  <MaskReveal delay={0.2}>
                    <div className={"relative..."}>
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "100%" }}
                        transition={{ duration: 0.75 }}
                      >
                        <div style={{ opacity: 1 }}>
                          <div className="max-w-[600px] text-muted-foreground md:text-xl">
                            <TextAnimation
                              text="Boost productivity with our platform."
                              type="words"
                              delay={0.5}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </MaskReveal>
                </MaskReveal>
              </MaskReveal>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
