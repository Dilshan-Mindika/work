"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ArticleNavigationProps {
  prevPost: {
    slug: string
    title: string
  } | null
  nextPost: {
    slug: string
    title: string
  } | null
}

export default function ArticleNavigation({ prevPost, nextPost }: ArticleNavigationProps) {
  return (
    <motion.nav
      className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      aria-label="Post navigation"
    >
      {prevPost && (
        <Link href={`/blog/${prevPost.slug}`} aria-label={`Previous article: ${prevPost.title}`}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>Previous Article</span>
              </div>
              <h3 className="font-medium line-clamp-2">{prevPost.title}</h3>
            </CardContent>
          </Card>
        </Link>
      )}

      {nextPost && (
        <Link href={`/blog/${nextPost.slug}`} className="sm:ml-auto" aria-label={`Next article: ${nextPost.title}`}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                <span>Next Article</span>
                <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </div>
              <h3 className="font-medium line-clamp-2 text-right">{nextPost.title}</h3>
            </CardContent>
          </Card>
        </Link>
      )}
    </motion.nav>
  )
}

