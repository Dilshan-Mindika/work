import { Card, CardContent } from "@/components/ui/card";

export default function TestimonialTriple() {
  const testimonials = [
    {
      quote:
        "SaaSify has streamlined our entire operation. What used to take days now takes minutes, and the insights we get from the analytics are game-changing.",
      author: "Michael Chen",
      title: "CTO, InnovateTech",
      avatar: "/placeholder.svg?height=64&width=64&text=MC",
    },
    {
      quote:
        "The automation capabilities alone have saved us countless hours of manual work. Our team can now focus on strategic initiatives instead of repetitive tasks.",
      author: "Emily Rodriguez",
      title: "Operations Director, GrowCorp",
      avatar: "/placeholder.svg?height=64&width=64&text=ER",
    },
    {
      quote:
        "As a small business, we needed an affordable solution that could scale with us. SaaSify has been the perfect partner for our growth journey.",
      author: "David Kim",
      title: "Founder, StartupBoost",
      avatar: "/placeholder.svg?height=64&width=64&text=DK",
    },
  ];

  return (
    <section className="w-full py-12 flex flex-col items-center md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Customer Stories
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Trusted by Businesses Worldwide
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              See how companies of all sizes are achieving success with our
              platform.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex mb-4">
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
                  <blockquote className="flex-1 mb-4 text-lg">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
