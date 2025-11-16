"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StaggerChildren, StaggerItem } from "@/components/ui/stagger-children";
import BlogPagination from "./blog-pagination";

// Mock data for blog posts - duplicate from page for client component
const blogPosts = [
  {
    id: 1,
    slug: "saas-growth-strategies-2025",
    title: "10 SaaS Growth Strategies That Will Dominate in 2025",
    excerpt:
      "Discover the cutting-edge strategies that will help your SaaS business thrive in the competitive landscape of 2025.",
    category: "Growth",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Growth Strategist",
    },
    date: "March 5, 2025",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    slug: "ai-powered-customer-support",
    title: "How AI is Revolutionizing Customer Support in SaaS",
    excerpt:
      "Explore how artificial intelligence is transforming customer support operations and improving satisfaction rates.",
    category: "Technology",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Samantha Lee",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "AI Specialist",
    },
    date: "March 3, 2025",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 3,
    slug: "product-led-growth-guide",
    title: "The Ultimate Guide to Product-Led Growth for SaaS Startups",
    excerpt:
      "Learn how to implement product-led growth strategies that can accelerate your SaaS startup's expansion.",
    category: "Growth",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Product Manager",
    },
    date: "February 28, 2025",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 4,
    slug: "saas-pricing-strategies",
    title: "SaaS Pricing Strategies: Finding Your Sweet Spot",
    excerpt:
      "Discover how to optimize your pricing structure to maximize revenue while remaining competitive in the market.",
    category: "Business",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Rachel Green",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Revenue Strategist",
    },
    date: "February 25, 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 5,
    slug: "remote-team-management",
    title: "Building and Managing High-Performing Remote SaaS Teams",
    excerpt:
      "Strategies and best practices for leading distributed teams to achieve exceptional results in the SaaS industry.",
    category: "Leadership",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "HR Director",
    },
    date: "February 20, 2025",
    readTime: "9 min read",
    featured: false,
  },
  {
    id: 6,
    slug: "saas-security-best-practices",
    title: "SaaS Security Best Practices for 2025",
    excerpt:
      "Essential security measures every SaaS company should implement to protect their platform and customer data.",
    category: "Technology",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Jennifer Martinez",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Security Expert",
    },
    date: "February 18, 2025",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: 7,
    slug: "customer-retention-strategies",
    title: "7 Customer Retention Strategies That Actually Work",
    excerpt:
      "Proven tactics to reduce churn and increase customer lifetime value in your SaaS business.",
    category: "Business",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Thomas Brown",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Customer Success Lead",
    },
    date: "February 15, 2025",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 8,
    slug: "saas-marketing-automation",
    title: "Marketing Automation Strategies for SaaS Companies",
    excerpt:
      "How to leverage automation to streamline your marketing efforts and drive more qualified leads.",
    category: "Marketing",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Emily Parker",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Marketing Director",
    },
    date: "February 12, 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 9,
    slug: "saas-funding-options",
    title: "Exploring Funding Options for Your SaaS Startup",
    excerpt:
      "A comprehensive guide to different funding paths available for SaaS entrepreneurs, from bootstrapping to venture capital.",
    category: "Business",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Robert Kim",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Finance Advisor",
    },
    date: "February 8, 2025",
    readTime: "9 min read",
    featured: false,
  },
];

interface BlogSearchProps {
  categories: {
    value: string;
    label: string;
  }[];
}

export default function BlogSearch({ categories }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts based on search query and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory && !post.featured;
  });

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search articles"
          />
        </div>
        <div>
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="w-full md:w-auto overflow-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {currentPosts.length > 0 ? (
        <section aria-labelledby="blog-posts">
          <h2 id="blog-posts" className="sr-only">
            Blog Posts
          </h2>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentPosts.map((post) => (
              <StaggerItem key={post.id}>
                <article className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-labelledby={`post-title-${post.id}`}
                    className="block h-full"
                  >
                    <Card className="h-full overflow-hidden group hover:shadow-md transition-shadow duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="" /* Decorative image, content described in heading */
                          fill
                          sizes="(min-width: 1024px) 384px, (min-width: 768px) 352px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary hover:bg-primary/90">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle
                          id={`post-title-${post.id}`}
                          className="line-clamp-2 group-hover:text-primary transition-colors"
                        >
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={post.author.avatar}
                              alt={`${post.author.name}'s profile`}
                            />
                            <AvatarFallback>
                              {post.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-2 flex-1">
                            <p className="text-sm font-medium">
                              {post.author.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex justify-between">
                        <div className="flex items-center">
                          <Calendar
                            className="h-3 w-3 mr-1"
                            aria-hidden="true"
                          />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                          <span>{post.readTime}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {filteredPosts.length > postsPerPage && (
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </>
  );
}
