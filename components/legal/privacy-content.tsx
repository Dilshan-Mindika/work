"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowUp,
  Clock,
  Shield,
  Eye,
  Lock,
  Server,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/ui/reveal";
import { StaggerChildren, StaggerItem } from "@/components/ui/stagger-children";
import { Logo } from "@/components/logo";

export default function PrivacyContent() {
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
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionHeight = rect.height;

        if (
          window.scrollY >= sectionTop - 100 &&
          window.scrollY < sectionTop + sectionHeight - 100
        ) {
          currentSection = section.getAttribute("id") || "";
        }
      });

      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section with offset calculation
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      const scrollTop = rect.top + window.scrollY - 80;

      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Sections data
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Shield className="h-4 w-4 mr-2" />,
    },
    {
      id: "information-collection",
      title: "Information Collection",
      icon: <Eye className="h-4 w-4 mr-2" />,
    },
    {
      id: "use-of-information",
      title: "Use of Information",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: <Server className="h-4 w-4 mr-2" />,
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="h-4 w-4 mr-2" />,
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      id: "international-transfers",
      title: "International Transfers",
      icon: <Server className="h-4 w-4 mr-2" />,
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      icon: <Shield className="h-4 w-4 mr-2" />,
    },
    {
      id: "changes",
      title: "Changes to Policy",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumbs */}

        <Link href="/">
          <Logo />
        </Link>
        <motion.div
          className="flex items-center text-sm text-muted-foreground mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Privacy Policy</span>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            At SaaSify, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our service.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last updated: March 7, 2025</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 xl:gap-12">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                          activeSection === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        }`}
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        {section.icon}
                        {section.title}
                      </motion.button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Table of Contents */}
          <div className="lg:hidden mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="sections">
                  <TabsList className="w-full">
                    <TabsTrigger value="sections" className="flex-1">
                      Sections
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="sections" className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {sections.map((section) => (
                        <motion.button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                            activeSection === section.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted"
                          }`}
                          whileHover={{ x: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          {section.icon}
                          {section.title}
                        </motion.button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="space-y-10">
            <StaggerChildren>
              <StaggerItem>
                <section id="introduction" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        1. Introduction
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            SaaSify ("we," "our," or "us") is committed to
                            protecting your privacy. This Privacy Policy
                            explains how we collect, use, disclose, and
                            safeguard your information when you visit our
                            website or use our platform and services
                            (collectively, the "Services").
                          </p>
                          <p>
                            Please read this Privacy Policy carefully. By
                            accessing or using our Services, you acknowledge
                            that you have read, understood, and agree to be
                            bound by all the terms of this Privacy Policy. If
                            you do not agree with our policies and practices,
                            please do not use our Services.
                          </p>
                          <p>
                            This Privacy Policy applies to information we
                            collect:
                          </p>
                          <ul>
                            <li>On our website and platform</li>
                            <li>Through mobile and desktop applications</li>
                            <li>
                              Through email, text, and other electronic
                              communications
                            </li>
                            <li>
                              When you interact with our advertising and
                              applications on third-party websites and services
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section
                  id="information-collection"
                  className="scroll-mt-24 mt-5"
                >
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <Eye className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        2. Information Collection
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            We collect several types of information from and
                            about users of our Services, including:
                          </p>
                          <h3>Personal Information</h3>
                          <p>
                            Personal information is data that can be used to
                            identify you directly or indirectly. We may collect
                            the following personal information:
                          </p>
                          <ul>
                            <li>
                              Name, email address, phone number, and billing
                              information
                            </li>
                            <li>Company name and job title</li>
                            <li>User credentials (username and password)</li>
                            <li>Profile information and preferences</li>
                            <li>Payment and transaction information</li>
                          </ul>

                          <h3>Usage Information</h3>
                          <p>
                            We also collect information about how you use our
                            Services:
                          </p>
                          <ul>
                            <li>
                              Log data (IP address, browser type, pages visited,
                              time spent)
                            </li>
                            <li>
                              Device information (hardware model, operating
                              system)
                            </li>
                            <li>Location information</li>
                            <li>Usage patterns and preferences</li>
                          </ul>

                          <h3>Information Collection Methods</h3>
                          <p>We collect this information:</p>
                          <ul>
                            <li>Directly from you when you provide it to us</li>
                            <li>
                              Automatically as you navigate through our Services
                            </li>
                            <li>
                              From third parties, such as business partners and
                              service providers
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section id="use-of-information" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <FileText className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        3. Use of Information
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            We use the information we collect about you for
                            various purposes, including:
                          </p>
                          <ul>
                            <li>
                              Providing, maintaining, and improving our Services
                            </li>
                            <li>
                              Processing transactions and sending related
                              information
                            </li>
                            <li>
                              Sending administrative notifications, such as
                              updates or security alerts
                            </li>
                            <li>
                              Responding to your comments, questions, and
                              requests
                            </li>
                            <li>
                              Personalizing your experience and delivering
                              content relevant to your interests
                            </li>
                            <li>
                              Monitoring and analyzing trends, usage, and
                              activities
                            </li>
                            <li>Marketing our products and services to you</li>
                            <li>
                              Detecting, preventing, and addressing technical
                              issues
                            </li>
                            <li>Complying with legal obligations</li>
                          </ul>

                          <p>
                            We may combine information we collect about you from
                            different sources to enhance our ability to provide
                            the Services.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section id="information-sharing" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <Server className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        4. Information Sharing
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            We may disclose personal information that we collect
                            or you provide:
                          </p>
                          <ul>
                            <li>To our subsidiaries and affiliates</li>
                            <li>
                              To contractors, service providers, and other third
                              parties we use to support our business
                            </li>
                            <li>
                              To fulfill the purpose for which you provide it
                            </li>
                            <li>
                              For any other purpose disclosed by us when you
                              provide the information
                            </li>
                            <li>With your consent</li>
                          </ul>

                          <p>We may also disclose your personal information:</p>
                          <ul>
                            <li>
                              To comply with any court order, law, or legal
                              process
                            </li>
                            <li>
                              To enforce our Terms of Service and other
                              agreements
                            </li>
                            <li>
                              If we believe disclosure is necessary to protect
                              the rights, property, or safety of SaaSify, our
                              customers, or others
                            </li>
                          </ul>

                          <p>
                            We do not sell, rent, or lease your personal
                            information to third parties without your consent.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section id="data-security" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <Lock className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        5. Data Security
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            We have implemented measures designed to secure your
                            personal information from accidental loss and from
                            unauthorized access, use, alteration, and
                            disclosure. All information you provide to us is
                            stored on secure servers behind firewalls.
                          </p>
                          <p>
                            The safety and security of your information also
                            depends on you. Where we have given you (or where
                            you have chosen) a password for access to certain
                            parts of our Services, you are responsible for
                            keeping this password confidential. We ask you not
                            to share your password with anyone.
                          </p>
                          <p>
                            Unfortunately, the transmission of information via
                            the internet is not completely secure. Although we
                            do our best to protect your personal information, we
                            cannot guarantee the security of your personal
                            information transmitted to our Services. Any
                            transmission of personal information is at your own
                            risk.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section id="your-rights" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <FileText className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        6. Your Rights
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            Depending on your location, you may have certain
                            rights regarding your personal information,
                            including:
                          </p>
                          <ul>
                            <li>
                              The right to access personal information we hold
                              about you
                            </li>
                            <li>
                              The right to request correction of inaccurate
                              personal information
                            </li>
                            <li>
                              The right to request deletion of your personal
                              information
                            </li>
                            <li>
                              The right to object to processing of your personal
                              information
                            </li>
                            <li>The right to data portability</li>
                            <li>The right to withdraw consent</li>
                          </ul>

                          <p>
                            To exercise these rights, please contact us using
                            the information provided in the "Contact Us"
                            section. We may need to verify your identity before
                            responding to your request.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section
                  id="international-transfers"
                  className="scroll-mt-24 mt-5"
                >
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <Server className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        7. International Transfers
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            Your personal information may be transferred to, and
                            maintained on, computers located outside of your
                            state, province, country, or other governmental
                            jurisdiction where the data protection laws may
                            differ from those in your jurisdiction.
                          </p>
                          <p>
                            If you are located outside the United States and
                            choose to provide information to us, please note
                            that we transfer the data to the United States and
                            process it there. Your submission of such
                            information represents your agreement to that
                            transfer.
                          </p>
                          <p>
                            We will take all steps reasonably necessary to
                            ensure that your data is treated securely and in
                            accordance with this Privacy Policy.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section id="children-privacy" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        8. Children's Privacy
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            Our Services are not intended for children under 16
                            years of age. We do not knowingly collect personal
                            information from children under 16. If you are under
                            16, do not use or provide any information on our
                            Services. If we learn we have collected or received
                            personal information from a child under 16 without
                            verification of parental consent, we will delete
                            that information.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section id="changes" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <FileText className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        9. Changes to Policy
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            We may update our Privacy Policy from time to time.
                            If we make material changes to how we treat our
                            users' personal information, we will notify you
                            through a notice on our website or by email.
                          </p>
                          <p>
                            The date the Privacy Policy was last revised is
                            identified at the top of the page. You are
                            responsible for periodically visiting our Services
                            and this Privacy Policy to check for any changes.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>

              <StaggerItem>
                <section id="contact" className="scroll-mt-24 mt-5">
                  <Reveal>
                    <div className="flex items-center mb-4">
                      <FileText className="h-6 w-6 mr-2 text-primary" />
                      <h2 className="text-2xl font-bold tracking-tight">
                        10. Contact Us
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <p>
                            If you have any questions about this Privacy Policy,
                            please contact us at:
                          </p>
                          <p className="font-medium">privacy@saasify.com</p>
                          <p>
                            SaaSify, Inc.
                            <br />
                            123 Tech Street
                            <br />
                            San Francisco, CA 94103
                            <br />
                            United States
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </section>
              </StaggerItem>
            </StaggerChildren>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 p-6 border rounded-lg bg-muted/50"
            >
              <h2 className="text-xl font-bold mb-4">
                Data Protection Officer
              </h2>
              <p className="mb-4">
                For specific privacy concerns or data requests, you can contact
                our Data Protection Officer at:
              </p>
              <p className="font-medium">dpo@saasify.com</p>
            </motion.div>
          </div>
        </div>
      </main>

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
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
