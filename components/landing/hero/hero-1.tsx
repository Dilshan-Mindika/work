"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, MaskReveal } from "@/components/ui/reveal";
import {
  FloatingElement,
  FloatingGroup,
} from "@/components/ui/floating-element";
import { TextAnimation, GradientText } from "@/components/ui/text-animation";
import { ParallaxLayer } from "@/components/ui/parallax-section";

export default function Hero1() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <section className="w-full flex flex-col items-center xs:pt-[55px] py-20 md:py-24 lg:py-32 xl:py-48 overflow-hidden relative">
      <motion.div
        className="container px-4 md:px-6 relative z-10"
        style={{ opacity, scale }}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-2">
              <MaskReveal>
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Introducing SaaSify
                </div>
              </MaskReveal>

              <MaskReveal delay={0.1}>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <GradientText>Streamline Your Workflow</GradientText> Like
                  Never Before
                </h1>
              </MaskReveal>
              <MaskReveal delay={0.2}>
                <div className="max-w-[600px] text-muted-foreground md:text-xl">
                  <TextAnimation
                    text="Boost productivity, reduce costs, and scale your business with our all-in-one SaaS platform."
                    type="words"
                    delay={0.5}
                  />
                </div>
              </MaskReveal>
            </div>
            <Reveal delay={0.3}>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="#pricing">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="gap-1 group relative overflow-hidden"
                    >
                      <span className="relative z-10">Get Lifetime Deal</span>
                      <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <ArrowRight className="h-4 w-4 relative z-10" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
                <Link href="#demo">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="relative overflow-hidden"
                    >
                      <span className="relative z-10">Free Trial</span>
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={{ y: "100%" }}
                        whileHover={{ y: "0%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                      >
                        <img
                          src={`/placeholder.svg`}
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    Join 10,000+ users
                  </span>
                </div>
                <div className="flex md:flex-row flex-col items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.svg
                        key={i}
                        className="h-4 w-4 fill-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </motion.svg>
                    ))}
                  </div>
                  <span className="text-muted-foreground">5.0 rating</span>
                </div>
              </div>
            </Reveal>
          </motion.div>
          <FloatingElement
            className="mx-auto flex items-center justify-center"
            duration={4}
            distance={15}
          >
            <motion.div
              className="relative h-[350px] w-full max-w-[500px] rounded-lg border bg-background p-2 shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="absolute left-0 top-0 h-full w-full rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
              <img
                src={`/static/images/dashboard.png`}
                alt="Dashboard Preview"
                className="h-full w-full rounded-md object-contain"
              />

              {/* Animated elements on the dashboard */}
              <motion.div
                className="absolute top-4 right-4 h-3 w-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute bottom-6 left-6 h-8 w-24 rounded-md bg-primary/10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Animated cursor effect */}
              <motion.div
                className="absolute h-3 w-3 rounded-full bg-primary/50 shadow-lg"
                animate={{
                  x: [50, 150, 250, 150, 50],
                  y: [50, 100, 150, 200, 150],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              {/* Animated data points */}
              <motion.div
                className="absolute top-1/3 left-1/4 h-20 w-40 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.div
                  className="h-2 w-full bg-primary/20 rounded-full mb-2"
                  animate={{ width: ["60%", "80%", "40%", "90%", "60%"] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="h-2 w-full bg-secondary/20 rounded-full mb-2"
                  animate={{ width: ["30%", "60%", "80%", "50%", "30%"] }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                />
                <motion.div
                  className="h-2 w-full bg-accent/20 rounded-full"
                  animate={{ width: ["80%", "40%", "60%", "90%", "80%"] }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                />
              </motion.div>
            </motion.div>
          </FloatingElement>
        </div>
      </motion.div>

      {/* Parallax background elements */}
      <ParallaxLayer
        className="absolute top-1/3 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]"
        speed={0.2}
      />
      <ParallaxLayer
        className="absolute bottom-1/4 right-0 -z-10 h-[250px] w-[250px] rounded-full bg-secondary/5 blur-[100px]"
        speed={0.3}
        direction="down"
      />
    </section>
  );
}
