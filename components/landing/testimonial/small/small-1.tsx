export default function TestimonialSmall() {
  return (
    <section className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              What Our Customers Say
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Don't just take our word for it. Here's what our customers have to
              say about SaaSify.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full">
                <img
                  src="/placeholder.svg?height=64&width=64&text=JD"
                  alt="John Doe"
                  className="h-full w-full object-cover"
                />
              </div>
              <blockquote className="mb-4 max-w-lg">
                <p className="text-lg font-medium italic">
                  "SaaSify has completely transformed how we operate. We've cut
                  our administrative work by 70% and can now focus on growing
                  our business instead of managing tools."
                </p>
              </blockquote>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-muted-foreground">
                  CEO, TechStart Inc.
                </p>
              </div>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 fill-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
