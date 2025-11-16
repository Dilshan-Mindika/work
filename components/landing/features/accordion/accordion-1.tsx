import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart,
  Clock,
  Cloud,
  Code,
  Lock,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturesAccordion() {
  return (
    <section className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Detailed Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Discover What Makes Us Different
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Explore our comprehensive feature set designed to transform your
              business operations.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <span>Advanced Analytics & Reporting</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-[3.25rem]">
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground">
                    Our powerful analytics engine provides real-time insights
                    into your business performance. Create custom reports,
                    visualize trends, and make data-driven decisions with ease.
                  </p>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    <li>
                      Interactive dashboards with drag-and-drop customization
                    </li>
                    <li>Scheduled reports delivered to your inbox</li>
                    <li>Export data in multiple formats (CSV, PDF, Excel)</li>
                    <li>Custom KPIs and goal tracking</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span>Workflow Automation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-[3.25rem]">
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground">
                    Eliminate repetitive tasks and streamline your processes
                    with our powerful automation engine. Create custom workflows
                    without coding knowledge.
                  </p>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    <li>
                      Visual workflow builder with drag-and-drop interface
                    </li>
                    <li>
                      Trigger-based automations (time, event, or condition)
                    </li>
                    <li>Multi-step approval processes</li>
                    <li>Conditional logic and branching workflows</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <span>Team Collaboration</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-[3.25rem]">
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground">
                    Foster teamwork and communication with our collaboration
                    tools. Keep everyone on the same page and working
                    efficiently.
                  </p>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    <li>Real-time document collaboration</li>
                    <li>Task assignment and tracking</li>
                    <li>Team chat and video conferencing</li>
                    <li>Shared calendars and scheduling</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <span>Cloud Infrastructure</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-[3.25rem]">
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground">
                    Our robust cloud infrastructure ensures your data is always
                    available, secure, and performing optimally.
                  </p>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    <li>99.9% uptime guarantee</li>
                    <li>Automatic backups and disaster recovery</li>
                    <li>Global CDN for fast access worldwide</li>
                    <li>Elastic scaling to handle traffic spikes</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Code className="h-5 w-5" />
                  </div>
                  <span>Developer API</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-[3.25rem]">
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground">
                    Extend and customize our platform with our comprehensive
                    API. Build custom integrations and workflows to meet your
                    specific needs.
                  </p>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    <li>RESTful API with comprehensive documentation</li>
                    <li>Webhooks for real-time event notifications</li>
                    <li>SDKs for popular programming languages</li>
                    <li>Developer sandbox for testing</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left text-lg font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <span>Enterprise Security</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-[3.25rem]">
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground">
                    Protect your sensitive data with our enterprise-grade
                    security features. We take security seriously so you don't
                    have to worry.
                  </p>
                  <ul className="ml-6 list-disc text-muted-foreground">
                    <li>SOC 2 and GDPR compliance</li>
                    <li>End-to-end encryption for all data</li>
                    <li>Multi-factor authentication</li>
                    <li>Role-based access controls</li>
                    <li>Regular security audits and penetration testing</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="#pricing">
            <Button className="gap-1">
              See Plans & Pricing <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
