import { AlertTriangle, CheckCircle } from "lucide-react";

export default function Problem1() {
  return (
    <section className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              The Problem
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Business Challenges in Today's Digital Landscape
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Companies are struggling with fragmented tools, inefficient
              processes, and scaling issues.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-20 items-center justify-center rounded-full  dark:bg-red-900/20">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Fragmented Tools</h3>
                  <p className="text-muted-foreground">
                    Using multiple disconnected tools leads to data silos,
                    inconsistencies, and wasted time switching between
                    platforms.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex  items-center justify-center rounded-full  ">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Manual Processes</h3>
                  <p className="text-muted-foreground">
                    Repetitive tasks consume valuable time that could be spent
                    on strategic initiatives and growth.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full  dark:bg-red-900/20">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Scaling Difficulties</h3>
                  <p className="text-muted-foreground">
                    As your business grows, existing systems often break down,
                    creating bottlenecks and limiting expansion.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full  dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SaaSify Solution</h3>
                  <p className="text-muted-foreground">
                    Our unified platform eliminates tool fragmentation, bringing
                    everything you need into one seamless experience.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full  dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Automation Power</h3>
                  <p className="text-muted-foreground">
                    Automate repetitive tasks and workflows, freeing your team
                    to focus on what truly matters.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full  dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Built to Scale</h3>
                  <p className="text-muted-foreground">
                    Our platform grows with you, handling increased workloads
                    without performance degradation.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
