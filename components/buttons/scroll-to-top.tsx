"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll to update active section and show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        if (
          window.scrollY >= sectionTop - 100 &&
          window.scrollY < sectionTop + sectionHeight - 100
        ) {
          currentSection = section.getAttribute("id") || "";
        }
      });

      setActiveSection(currentSection);
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

  return (
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
    >
      <ArrowUp className="h-5 w-5" />
    </motion.button>
  );
}
