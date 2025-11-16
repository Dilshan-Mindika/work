"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import LeadButton from "@/components/buttons/lead-button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function NewsletterSubscribe() {
  const [leadEmail, setLeadEmail] = useState("");
  return (
    <>
      <motion.div
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
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter your email"
              type="email"
              className="flex-1"
              onChange={(e) => setLeadEmail(e.target.value)}
            />
            {/* <Button className="whitespace-nowrap"></Button> */}

            <LeadButton email={leadEmail} className="whitespace-nowrap">
              Subscribe
              <Mail className="ml-2 h-4 w-4" />
            </LeadButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
