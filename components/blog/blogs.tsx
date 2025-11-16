"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Mail,
} from "lucide-react";
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
import LeadButton from "../buttons/lead-button";
import { Category, Posts } from "@/types/blog";

export default function Blogs({
  blogPosts,
  cats,
}: {
  blogPosts: Posts;
  cats: Category[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const categories = [
    {
      label: "All Post",
      value: "all",
    },
    ...cats,
  ];

  const [leadEmail, setLeadEmail] = useState("");

  // Get featured post
  const featuredPost = blogPosts.find((post) => post.isFeatured);
  // Filter posts based on search query and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      post.categories[0].toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
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
    <div className="min-h-screen mx-auto max-w-screen-lg mt-20 flex flex-col items-center bg-background">
      <main className="container px-4 py-8 md:px-6 md:py-12">
        {/* Page Title */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Our Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights, strategies, and stories to help you build, grow, and
            optimize your SaaS business.
          </p>
        </motion.div>
        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative overflow-hidden rounded-xl">
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="group relative">
                  <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                    <Image
                      src={featuredPost.mainImage || "/placeholder.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <Badge className="mb-3 bg-primary hover:bg-primary/90">
                      {featuredPost.categories[0]}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/80 mb-4 max-w-3xl">
                      {featuredPost.summary}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 border-2 border-white">
                          <AvatarImage
                            src={featuredPost.author.image}
                            alt={featuredPost.author.name}
                          />
                          <AvatarFallback>
                            {featuredPost.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">
                            {featuredPost.author.name}
                          </p>
                          {/* <p className="text-xs text-white/70">
                            {featuredPost.author.role}
                          </p> */}
                        </div>
                      </div>
                      <div className="flex items-center text-white/70 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="mr-3">
                          {featuredPost.publishedAt.toString()}
                        </span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{featuredPost.readingTime} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
        {/* Search and Filter */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentPosts.map((post) => (
              <StaggerItem key={post._id}>
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <Card className="h-full overflow-hidden group hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.mainImage || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary hover:bg-primary/90">
                          {post.categories[0]}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {post.summary}
                      </p>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={post.author.image}
                            alt={post.author.name}
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
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{post.publishedAt.toString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readingTime} minutes</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter to find what you're looking
              for.
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
          <div className="flex justify-center items-center gap-2 my-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="icon"
                    onClick={() => paginate(number)}
                    className="w-8 h-8"
                  >
                    {number}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        {/* Newsletter Subscription */}
        <motion.div
          className="mt-16 mb-8 bg-muted rounded-xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Subscribe to our newsletter
              </h2>
              <p className="text-muted-foreground mb-4">
                Get the latest SaaS insights delivered straight to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1 border ring"
                onChange={(e) => setLeadEmail(e.target.value)}
              />
              {/* <Button className="whitespace-nowrap"></Button> */}

              <LeadButton email={leadEmail} className="whitespace-nowrap">
                Subscribe
                <Mail className="ml-2 h-4 w-4" />
              </LeadButton>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
