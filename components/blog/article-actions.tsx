"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Facebook, Linkedin, LinkIcon, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Social share functions
  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = document.title;
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    const title = document.title;
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  return (
    <>
      {/* Share buttons */}
      <motion.div
        className="fixed left-4 bottom-1/3 flex flex-col gap-2 hidden md:flex"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: showScrollTop ? 1 : 0, x: showScrollTop ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="Share on Twitter"
          onClick={shareOnTwitter}
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Share on Facebook"
          onClick={shareOnFacebook}
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Share on LinkedIn"
          onClick={shareOnLinkedIn}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          aria-label="Copy link to clipboard"
          className="relative"
        >
          <LinkIcon className="h-4 w-4" />
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -right-20 bg-primary text-primary-foreground text-xs py-1 px-2 rounded whitespace-nowrap"
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg z-50"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 20,
        }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </motion.button>
    </>
  );
}
