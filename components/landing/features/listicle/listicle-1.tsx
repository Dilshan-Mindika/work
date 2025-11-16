import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturesListicle() {
  return (
    <section
      id="features"
      className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32 bg-muted/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Our comprehensive feature set is designed to help your business
              thrive in the digital age.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Unified Dashboard</h3>
              <p className="text-muted-foreground">
                Get a complete overview of your business performance with our
                intuitive dashboard that brings together metrics from all
                aspects of your operation.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Intelligent Automation</h3>
              <p className="text-muted-foreground">
                Automate repetitive tasks with our AI-powered workflow engine.
                Create custom automation rules without coding knowledge and
                watch your efficiency soar.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Gain deep insights into your business with powerful analytics
                tools. Visualize trends, identify opportunities, and make
                data-driven decisions.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Seamless Integrations</h3>
              <p className="text-muted-foreground">
                Connect with your favorite tools and services through our
                extensive library of integrations. Import and export data with
                ease.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Enterprise-Grade Security</h3>
              <p className="text-muted-foreground">
                Rest easy knowing your data is protected with bank-level
                encryption, role-based access controls, and regular security
                audits.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="#pricing">
            <Button className="gap-1">
              <>
                Explore All Features <ArrowRight className="h-4 w-4" />
              </>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
