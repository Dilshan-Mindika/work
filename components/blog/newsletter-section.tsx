"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter subscription logic here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <motion.section
      className="mt-16 mb-8 bg-muted rounded-xl p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Subscribe to our newsletter
          </h2>
          <p className="text-muted-foreground mb-4">
            Get the latest SaaS insights delivered straight to your inbox.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Input
            placeholder="Enter your email"
            type="email"
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            required
          />
          <Button
            type="submit"
            className="whitespace-nowrap"
            disabled={isSubmitted}
          >
            {isSubmitted ? "Subscribed!" : "Subscribe"}
            <Mail className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </motion.section>
  );
}
