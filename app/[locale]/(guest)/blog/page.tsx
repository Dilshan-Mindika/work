import Blogs from "@/components/blog/blogs";
import { getAllCategory, getAllPosts } from "@/lib/queries";
import { Metadata } from "next";

// SEO Metadata
export const metadata: Metadata = {
  title: "Blog ",
  description:
    "Discover strategies, tips, and insights to help your SaaS business grow. Articles on product development, marketing, customer success, and more.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saasify.com/blog",
    title: "SaaSify Blog | Insights for Your Business Growth",
    description:
      "Discover strategies, tips, and insights to help your SaaS business grow. Articles on product development, marketing, customer success, and more.",
    siteName: "SaaSify",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "SaaSify Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSify Blog | Insights for Your Business Growth",
    description:
      "Discover strategies, tips, and insights to help your SaaS business grow. Articles on product development, marketing, customer success, and more.",
    images: ["/og-blog.jpg"],
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categories = await getAllCategory();

  return <Blogs cats={categories} blogPosts={posts} />;
}
