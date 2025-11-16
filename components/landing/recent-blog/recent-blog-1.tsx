import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import NewsletterSubscribe from "@/components/lead-gen/news-letter-subscribe";
import { BlogArticle } from "@/types/blog";

export default function RecentBlog1({ posts }: { posts: BlogArticle[] }) {
  return (
    <section
      id="blog"
      className="w-full flex flex-col items-center py-12 md:py-24 lg:py-32 bg-muted/50"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Our Blog
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Latest Insights & Resources
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Stay up to date with the latest trends, tips, and best practices
              in the SaaS industry.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={post.mainImage}
                  alt={post.title}
                  className="h-full w-full rounded-t-lg object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {post.categories[0]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-xl">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.summary}
                </p>
              </CardContent>
              <CardFooter className="p-4">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-muted-foreground">
                    {post.readingTime} min read
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/blog">
            <Button variant="outline" className="gap-1">
              View All Articles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <NewsletterSubscribe />
    </section>
  );
}
