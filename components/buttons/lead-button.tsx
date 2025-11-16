"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export type LeadButtonTypes = {
  children: React.ReactNode;
  className?: string;
  email: string;
  successMessage?: string;
};

// Email validation regex
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Extract domain from email
const getEmailDomain = (email: string) => {
  return email.substring(email.lastIndexOf("@") + 1);
};

// Function to check if domain has a valid MX record
const isValidDomain = async (domain: string) => {
  try {
    const res = await fetch(`/api/public/check-domain?domain=${domain}`);
    const data = await res.json();
    return data.valid; // Should return true if the domain has valid MX records
  } catch (error) {
    return false;
  }
};

export default function LeadButton({
  children,
  className,
  email,
  successMessage,
}: LeadButtonTypes) {
  const [loading, setLoading] = useState(false);

  const handlerSubmit = async () => {
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }

    const domain = getEmailDomain(email);
    setLoading(true);

    const domainValid = await isValidDomain(domain);
    if (!domainValid) {
      toast.error("Invalid email domain!");
      setLoading(false);
      return;
    }

    // Proceed with adding lead
    const res = await fetch(`/api/public/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Something went wrong!");
      setLoading(false);
      return;
    }

    toast.success(successMessage || "Subscribe success!");
    setLoading(false);
  };

  return (
    <Button
      disabled={loading}
      onClick={handlerSubmit}
      className={cn(className)}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
