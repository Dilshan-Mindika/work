"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { StaggerChildren, StaggerItem } from "@/components/ui/stagger-children";

export default function TestimonialGrid() {
  const testimonials = [
    {
      quote:
        "SaaSify has completely transformed our workflow. We've reduced our administrative overhead by 60% and can now focus on what really matters.",
      author: "Alex Thompson",
      title: "CEO, FutureTech",
      avatar: "/placeholder.svg?height=48&width=48&text=AT",
      rating: 5,
    },
    {
      quote:
        "The analytics capabilities alone are worth the investment. We now have insights we never had access to before.",
      author: "Jessica Lee",
      title: "Marketing Director, GrowthHub",
      avatar: "/placeholder.svg?height=48&width=48&text=JL",
      rating: 5,
    },
    {
      quote:
        "Customer support is exceptional. Any time we've had an issue, the team has been quick to respond and resolve it.",
      author: "Robert Chen",
      title: "IT Manager, Enterprise Solutions",
      avatar: "/placeholder.svg?height=48&width=48&text=RC",
      rating: 5,
    },
    {
      quote:
        "As a startup, we needed something that could grow with us. SaaSify has scaled perfectly as our team has expanded from 5 to 50 people.",
      author: "Maria Garcia",
      title: "Operations Lead, StartupX",
      avatar: "/placeholder.svg?height=48&width=48&text=MG",
      rating: 5,
    },
    {
      quote:
        "The automation features have saved us countless hours of manual work. What used to take days now happens automatically.",
      author: "James Wilson",
      title: "Product Manager, InnovateCo",
      avatar: "/placeholder.svg?height=48&width=48&text=JW",
      rating: 5,
    },
    {
      quote:
        "We evaluated several platforms before choosing SaaSify. The combination of features, ease of use, and price point made it the clear winner.",
      author: "Sophia Kim",
      title: "CFO, FinanceFirst",
      avatar: "/placeholder.svg?height=48&width=48&text=SK",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-1/4 h-60 w-60 rounded-full bg-primary/5 blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          y: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-0 flex flex-col items-center text-center right-1/4 h-60 w-60 rounded-full bg-secondary/5 blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          delay: 3,
        }}
      />

      <div className="container px-4 md:px-6 relative flex flex-col items-center">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Reveal className="flex flex-col items-center">
              <div className=" rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Testimonials
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Loved by Businesses Everywhere
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Don't take our word for it. See what our customers have to say
                about SaaSify.
              </p>
            </Reveal>
          </div>
        </div>
        <StaggerChildren
          className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          delay={0.3}
        >
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <motion.svg
                            key={i}
                            className="h-5 w-5 fill-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * i }}
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </motion.svg>
                        )
                      )}
                    </div>
                    <blockquote className="mb-4 text-sm">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <motion.div
                        className="mr-3 h-8 w-8 overflow-hidden rounded-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.author}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                      <div>
                        <p className="text-sm font-semibold">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
        <Reveal delay={0.6}>
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={`/placeholder.svg?height=32&width=32&text=${i}`}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-muted-foreground">
                Join 10,000+ satisfied customers
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
