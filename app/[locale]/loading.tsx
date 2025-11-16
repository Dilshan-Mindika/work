"use client";
import { motion } from "framer-motion";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <motion.div
      className="fixed flex flex-col justify-center items-center z-[1000] top-0 left-0 w-full h-full bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              y: [0, -10, 0], // Bouncing effect
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
