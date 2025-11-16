import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQ() {
  const faqs = [
    {
      question: "How does the 14-day free trial work?",
      answer:
        "Our 14-day free trial gives you full access to all features of the plan you choose. No credit card is required to start, and you can cancel anytime. At the end of the trial, you can choose to subscribe or your account will automatically downgrade to our limited free plan.",
    },
    {
      question: "Can I change plans later?",
      answer:
        "You can upgrade, downgrade, or change your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle.",
    },
    {
      question: "Is there a limit to how many users I can add?",
      answer:
        "The user limit depends on your plan. The Starter plan allows up to 5 users, Professional up to 20 users, and Enterprise has unlimited users. You can always upgrade your plan if you need to add more users.",
    },
    {
      question:
        "Do you offer discounts for nonprofits or educational institutions?",
      answer:
        "Yes, we offer special pricing for qualified nonprofits, educational institutions, and startups. Please contact our sales team to learn more about our discount programs and to verify eligibility.",
    },
    {
      question: "How secure is my data on your platform?",
      answer:
        "Security is our top priority. We use bank-level encryption for all data, both in transit and at rest. We're SOC 2 and GDPR compliant, conduct regular security audits, and offer features like two-factor authentication and role-based access controls.",
    },
    {
      question: "Can I integrate with other tools and services?",
      answer:
        "Yes, our platform offers extensive integration capabilities. We have pre-built integrations with popular tools like Slack, Google Workspace, Microsoft 365, Salesforce, and many more. We also provide a comprehensive API for custom integrations.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "All plans include access to our help center, community forum, and email support. Response times vary by plan: Starter (24 hours), Professional (12 hours), and Enterprise (4 hours). Enterprise plans also include phone support and a dedicated account manager.",
    },
    {
      question: "Can I export my data if I decide to cancel?",
      answer:
        "Yes, you maintain ownership of your data and can export it at any time, including if you decide to cancel your subscription. We provide easy-to-use export tools in various formats (CSV, Excel, etc.) to ensure you always have access to your information.",
    },
  ];

  return (
    <section
      id="faq"
      className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Find answers to common questions about our platform, pricing, and
              policies.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="text-primary underline underline-offset-4"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
