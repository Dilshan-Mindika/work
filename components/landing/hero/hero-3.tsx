"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight, Sparkles, Zap, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero3() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const mouseXSpring = useSpring(mouseX, { damping: 25, stiffness: 700 });
  const mouseYSpring = useSpring(mouseY, { damping: 25, stiffness: 700 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  return (
    <section
      ref={containerRef}
      className="relative flex justify-center pt-[120px] overflow-hidden min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background via-purple-900/5 to-secondary/10 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10"></div>
      </div>

      {/* Content */}
      <motion.div
        className="container relative z-20"
        style={{ opacity, scale, y }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Enhanced badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-6"
          >
            <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
              <Sparkles className="w-3 h-3 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Next-Gen Glassmorphism
              <Zap className="w-3 h-3 ml-2 group-hover:scale-125 transition-transform duration-300" />
            </Badge>
          </motion.div>

          {/* Enhanced title */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight"
            initial={{ opacity: 0, y: 30, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
            style={{
              transformStyle: "preserve-3d",
              transform: isHovered
                ? `perspective(1000px) rotateX(${mouseYSpring.get() * 0.01}deg) rotateY(${mouseXSpring.get() * 0.01}deg)`
                : "perspective(1000px)",
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
              Immersive
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-secondary via-pink-500 to-primary">
              Glassmorphism
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Experience
            </span>
          </motion.h1>

          {/* Enhanced description */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Experience the future of web design with our cutting-edge
            glassmorphism components. Featuring advanced animations, particle
            effects, and interactive 3D transformations.
          </motion.p>

          {/* Enhanced CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Launch Experience</span>
              <ArrowRight className="ml-3 h-5 w-5 transition-all duration-300 group-hover:translate-x-2 group-hover:rotate-12" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-primary/30 hover:bg-primary/10 text-lg px-8 py-4 rounded-xl backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Enhanced glass card */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            style={{
              transformStyle: "preserve-3d",
              transform: isHovered
                ? `perspective(1000px) rotateX(${mouseYSpring.get() * 0.005}deg) rotateY(${mouseXSpring.get() * 0.005}deg)`
                : "perspective(1000px)",
            }}
          >
            {/* Glow layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-2xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>

            <div className="relative backdrop-blur-xl bg-background/20 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    number: "99.9%",
                    label: "Customer Satisfaction",
                    icon: Star,
                    color: "from-yellow-400 to-orange-500",
                  },
                  {
                    number: "24/7",
                    label: "AI-Powered Support",
                    icon: Zap,
                    color: "from-blue-400 to-purple-500",
                  },
                  {
                    number: "500+",
                    label: "Premium Components",
                    icon: Sparkles,
                    color: "from-pink-400 to-red-500",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6 + index * 0.1,
                      type: "spring",
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color} mb-2`}
                    >
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-primary/30 to-purple-500/30 blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-secondary/30 to-pink-500/30 blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.5, 0.1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          className="absolute top-2/3 left-2/3 h-40 w-40 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -50, 0],
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.4, 0.1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Particle effects */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Geometric shapes */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-16 h-16 border border-primary/20 rounded-lg"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-1/3 left-1/4 w-12 h-12 border border-secondary/20 rounded-full"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Mouse follower effect */}
      <motion.div
        className="fixed w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
        }}
        animate={{
          scale: isHovered ? 2 : 1,
          opacity: isHovered ? 0.8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </section>
  );
}
