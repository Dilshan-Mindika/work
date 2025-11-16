"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Bookmark, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ArticleSidebarProps {
  tableOfContents: string[]
  relatedPosts: any[]
}

export default function ArticleSidebar({ tableOfContents, relatedPosts }: ArticleSidebarProps) {
  const [activeSection, setActiveSection] = useState("")

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = document.querySelectorAll("h2")
      let currentSection = ""

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          currentSection = section.textContent || ""
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to section
  const scrollToSection = (sectionText: string) => {
    const sections = document.querySelectorAll("h2")
    sections.forEach((section) => {
      if (section.textContent === sectionText) {
        window.scrollTo({
          top: section.offsetTop - 100,
          behavior: "smooth",
        })
      }
    })
  }

  return (
    <aside className="space-y-8">
      {/* Table of Contents */}
      {tableOfContents.length > 0 && (
        <div className="sticky top-24">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-medium mb-3">Table of Contents</h2>
              <nav className="space-y-1">
                {tableOfContents.map((heading, index) => (
                  <motion.button
                    key={index}
                    onClick={() => scrollToSection(heading)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === heading ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                    }`}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    aria-current={activeSection === heading ? "location" : undefined}
                  >
                    {heading}
                  </motion.button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Save Article */}
          <div className="mt-4">
            <Button variant="outline" className="w-full" size="sm">
              <Bookmark className="h-4 w-4 mr-2" aria-hidden="true" />
              Save for later
            </Button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="font-medium mb-3">Related Articles</h2>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    key={relatedPost.id}
                    aria-labelledby={`related-title-${relatedPost.id}`}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32">
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt="" /* Decorative, title describes the content */
                          fill
                          sizes="(min-width: 1024px) 300px, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 id={`related-title-${relatedPost.id}`} className="font-medium text-sm line-clamp-2 mb-1">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                          <span>{relatedPost.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

