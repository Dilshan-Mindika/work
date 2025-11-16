import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WithWithout1() {
  return (
    <section className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Transform Your Workflow
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              See the difference SaaSify makes in your daily operations.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-4xl">
          <Tabs defaultValue="without" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="without">Without SaaSify</TabsTrigger>
              <TabsTrigger value="with">With SaaSify</TabsTrigger>
            </TabsList>
            <TabsContent value="without" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          Multiple Disconnected Tools
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Juggling between 5-10 different tools for various
                          business functions, leading to data silos and
                          inconsistencies.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          Time-Consuming Manual Tasks
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Spending 15+ hours weekly on data entry, report
                          generation, and other repetitive tasks.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          Limited Visibility
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          No real-time insights into business performance,
                          making it difficult to make informed decisions
                          quickly.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          Scaling Challenges
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          As your business grows, your systems become
                          increasingly complex and difficult to manage.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">High Costs</h3>
                        <p className="text-sm text-muted-foreground">
                          Paying for multiple subscriptions and spending on
                          integration solutions that still don't work perfectly.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="with" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          All-in-One Platform
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          A single unified platform for all your business needs,
                          with seamless data flow between functions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          Automation & Efficiency
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Reduce manual work by 80% with intelligent automation
                          of repetitive tasks and workflows.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          Real-Time Analytics
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive dashboards with real-time data
                          visualization for instant business insights.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          Scalable Architecture
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Our cloud-based platform scales effortlessly with your
                          business, from startup to enterprise.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">Cost Savings</h3>
                        <p className="text-sm text-muted-foreground">
                          Reduce total software costs by 40% while increasing
                          productivity and eliminating integration headaches.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
