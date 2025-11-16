"use client";

import { useAppContext } from "@/context/app";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadUserData() {
  const { setBilling, user, setUser, billing } = useAppContext();
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchUserBillingData = async () => {
    setLoading(true);
    const res = await fetch(`/api/app`, {
      method: "GET",
      cache: "force-cache",
    });

    if (!res.ok) return;

    const data = await res.json();
    setBilling(data.billing);
    setUser(data.user);
    setLoading(false);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchUserBillingData();
    }
  }, [isSignedIn]);

  return (
    <>
      {loading && (
        <motion.div
          className="fixed flex flex-col justify-center items-center z-[1000] top-0 left-0 w-full h-full bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-lg font-semibold mb-4">Loading...</p>
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
      )}
    </>
  );
}
