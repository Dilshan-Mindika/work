"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Hero4() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video control functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative justify-center  flex md:mt-20 py-20 overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 mb-4">
                Video Hero
              </Badge>
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Understand Our Product
                <span className="block text-primary">in Just 2 Minutes</span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Our explainer video shows you exactly how our platform works and
                how it can transform your workflow.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Video Player */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="relative rounded-xl overflow-hidden border shadow-xl bg-black aspect-video">
              {/* Video element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="/placeholder.svg?height=720&width=1280&text=Video+Thumbnail"
                muted={isMuted}
                playsInline
                onClick={togglePlay}
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-software-interface-for-a-business-app-67742-large.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Play/Pause overlay button */}
              <AnimatePresence>
                {(!isPlaying ||
                  showControls ||
                  (typeof window !== "undefined" &&
                    window.innerWidth < 768)) && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className="bg-primary/90 hover:bg-primary text-white rounded-full p-4 backdrop-blur-sm"
                      onClick={togglePlay}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video controls */}
              <AnimatePresence>
                {(showControls ||
                  (typeof window !== "undefined" &&
                    window.innerWidth < 768)) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize2 className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-6xl w-[90vw] p-0 bg-black">
                        <div className="relative aspect-video">
                          <video
                            className="w-full h-full"
                            controls
                            autoPlay
                            poster="/placeholder.svg?height=720&width=1280&text=Video+Thumbnail"
                          >
                            <source
                              src="https://assets.mixkit.co/videos/preview/mixkit-software-interface-for-a-business-app-67742-large.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
