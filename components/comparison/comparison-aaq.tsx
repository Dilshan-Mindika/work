"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How easy is it to migrate from Competitor A to SaaSify?",
    answer:
      "We've designed our migration process to be as seamless as possible. SaaSify provides dedicated migration tools that can import your data directly from Competitor A. Our team will also provide personalized support throughout the transition, including custom data mapping and validation to ensure nothing is lost. Most customers complete the migration within 1-2 weeks, with minimal disruption to their operations.",
  },
  {
    question:
      "Will I lose any functionality by switching from Competitor B to SaaSify?",
    answer:
      "No, you won't lose functionality. In fact, our feature comparison shows that SaaSify offers all the core capabilities of Competitor B plus additional features. In the rare case where there's a specific feature you use in Competitor B that doesn't have an exact equivalent in SaaSify, our team will work with you to find an alternative approach or potentially add it to our development roadmap.",
  },
  {
    question:
      "How does SaaSify's pricing compare to Competitor C over the long term?",
    answer:
      "While our starting price may be slightly higher than Competitor C, customers typically find that SaaSify provides better value over time. This is because we include many features in our base packages that Competitor C charges extra for. Additionally, the efficiency gains from our automation capabilities often result in significant time savings, which translates to reduced operational costs. Our pricing is also more transparent, with no hidden fees or steep annual increases.",
  },
  {
    question: "Can SaaSify handle the same volume of data as Competitor A?",
    answer:
      "Yes, SaaSify is built on a modern, scalable infrastructure that can handle enterprise-level data volumes. Our platform has been benchmarked to outperform Competitor A in large data processing tasks, with up to 40% faster performance for complex operations. We also offer more flexible storage options and data retention policies to help optimize your costs as your data needs grow.",
  },
  {
    question: "How does SaaSify's customer support compare to the competition?",
    answer:
      "Customer support is an area where we consistently outshine our competitors. Unlike Competitor B and C, who only offer premium support for enterprise plans, SaaSify provides 24/7 support for all customers, regardless of plan tier. Our average response time is under 2 hours, compared to 24+ hours for most competitors. We also offer multiple support channels including live chat, email, and phone, as well as an extensive knowledge base and regular training webinars.",
  },
  {
    question: "What integrations does SaaSify offer that competitors don't?",
    answer:
      "SaaSify offers over 200 pre-built integrations, which is significantly more than any of our competitors. Some notable exclusive integrations include advanced connections with emerging AI platforms, specialized industry tools, and enterprise systems that competitors often ignore. Additionally, our open API and webhook system makes it possible to build custom integrations with virtually any service, even if we don't offer a pre-built connector.",
  },
  {
    question: "How secure is SaaSify compared to other solutions?",
    answer:
      "Security is a top priority at SaaSify. We maintain all major security certifications including SOC 2 Type II, GDPR, HIPAA, and ISO 27001 compliance. Unlike some competitors who only encrypt data in transit, we provide end-to-end encryption for all customer data. We also offer more advanced authentication options, including biometric verification and hardware security keys, which many competitors don't support.",
  },
  {
    question: "Do I need technical expertise to use SaaSify effectively?",
    answer:
      "No, SaaSify is designed to be user-friendly for both technical and non-technical users. Our intuitive interface and no-code automation tools allow anyone to build sophisticated workflows without programming knowledge. For more advanced users, we do offer developer tools and APIs, but they're entirely optional. Many of our customers report that SaaSify requires less technical expertise than competitors while offering more powerful capabilities.",
  },
];

export default function ComparisonFAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
}
