"use client";

import { motion } from "framer-motion";
import { TextAnimation } from "@/components/ui/text-animation";
import { ParallaxSection } from "@/components/ui/parallax-section";

export default function FounderMessage() {
  return (
    <ParallaxSection className="w-full py-12 md:py-24 lg:py-32 bg-zinc-950 text-zinc-200">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] items-start">
          {/* Award Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="mx-auto lg:mx-0"
          >
            <div className="w-full max-w-[400px] aspect-square bg-[#FDFBF3] rounded-3xl p-8 flex flex-col items-center justify-center text-zinc-900 relative overflow-hidden">
              {/* Rays background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZCIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC4xIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIvPjwvc3ZnPg==')] opacity-50" />

              {/* Laurel wreaths */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px]">
                <motion.img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-06%20at%2010.28.10%E2%80%AFPM-SBMb2BVGMmBjgf5PkCusaMh5h0dDOj.png"
                  alt="Laurel Wreath"
                  className="w-full h-full object-contain opacity-30"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 5 }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>

              {/* Profile image */}
              <motion.div
                className="relative w-32 h-32 rounded-3xl overflow-hidden mb-6 bg-orange-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src="/placeholder.svg?height=128&width=128&text=Alex"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center z-10"
              >
                <div className="text-[#B5A887] text-6xl font-bold mb-2">
                  2023
                </div>
                <div className="text-[#B5A887] text-xl font-medium">
                  Maker of the Year
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Message Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <TextAnimation
                text="Hey, Innovator from Silicon Valley 🌉"
                className="text-2xl md:text-3xl font-medium text-zinc-400 mb-4"
              />
              <div className="space-y-2">
                <p className="text-xl md:text-2xl">
                  It's Alex, maker of SaaSify. I built{" "}
                  <span className="text-primary font-semibold underline decoration-primary/30 underline-offset-4">
                    12 successful SaaS products in 5 years
                  </span>
                  . People ask me:
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3 text-zinc-400 text-lg md:text-xl"
            >
              <p>— How do you manage multiple tools efficiently?</p>
              <p>— What's the secret to scaling operations smoothly?</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-xl md:text-2xl font-medium mb-6">
                Answer: You need a unified platform that grows with you
              </p>
              <p className="text-zinc-400 text-lg mb-8">
                I'm an entrepreneur who moves fast and needs to make decisions
                faster. So I built SaaSify for 3 reasons:
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Unify workflows",
                    description:
                      "— bring all your tools and data into one seamless platform",
                  },
                  {
                    title: "Automate operations",
                    description:
                      "— eliminate repetitive tasks and focus on growth",
                  },
                  {
                    title: "Scale effortlessly",
                    description:
                      "— adapt and expand without hitting operational ceiling",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-primary font-bold text-lg">
                      {index + 1}.
                    </span>
                    <div>
                      <span className="text-lg font-medium">{item.title}</span>{" "}
                      <span className="text-zinc-400">{item.description}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
