import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArticleContent from "@/components/blog/article-content";
import ArticleSidebar from "@/components/blog/article-sidebar";
import ArticleActions from "@/components/blog/article-actions";
import ArticleNavigation from "@/components/blog/article-navigation";
import { SiteSettings } from "@/lib/config/settings";
import { BlogArticle } from "@/types/blog";
import { getAllPosts, getPostBySlug } from "@/lib/queries";

// Mock data for blog posts

type Params = Promise<{ slug: string }>;

// Generate metadata for each blog post dynamically
export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const slug = params.slug;

  // Wait for params.slug to be available
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `${SiteSettings.domainUrl}/blog/${post.slug}`,
      title: post.title,
      description: post.seoDescription || post.summary,
      siteName: SiteSettings.name,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.mainImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.seoDescription || post.summary,
      images: [post.mainImage],
    },
  };
}

export default async function BlogPostPage(props: { params: Params }) {
  const params = await props.params;
  if (!params.slug) {
    notFound();
  }
  const post = await getPostBySlug(params.slug);

  // If post not found, return 404
  if (!post) {
    notFound();
  }

  // Extract headings from content for table of contents
  const extractHeadings = () => {
    const headingRegex = /<h2>(.*?)<\/h2>/g;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(post.content as any)) !== null) {
      headings.push(match[1]);
    }

    return headings;
  };

  const tableOfContents = extractHeadings();

  const blogPosts: BlogArticle[] = await getAllPosts();

  // Find related posts
  const relatedPosts = post.relatedPosts
    ? blogPosts.filter((p) => post.relatedPosts?.includes(p._id))
    : [];

  // Find next and previous posts
  const currentIndex = blogPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background mt-20 flex flex-col items-center mx-auto max-w-screen-lg w-full">
      {/* Skip to content link for accessibility */}
      <a
        href="#article-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
      >
        Skip to content
      </a>

      {/* JSON-LD structured data for this article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            image: post.mainImage,
            datePublished: post.publishedAt,
            author: {
              "@type": "Person",
              name: post.author?.name,
              jobTitle: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: SiteSettings.name,
              logo: {
                "@type": "ImageObject",
                url: `${SiteSettings.domainUrl}/${SiteSettings.logoUrlLight}`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SiteSettings.domainUrl}/blog/${post.slug}`,
            },
            keywords: post.tags ? post.tags.join(", ") : "",
          }),
        }}
      />

      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SiteSettings.domainUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${SiteSettings.domainUrl}/blog`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `${SiteSettings.domainUrl}/blog/${post.slug}`,
              },
            ],
          }),
        }}
      />

      <main
        id="main-content"
        className="container px-4 py-8 md:px-6 md:py-12 w-full"
      >
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center text-sm text-muted-foreground mb-6"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" aria-hidden="true" />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" aria-hidden="true" />
          <span className="truncate max-w-[200px]" aria-current="page">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-8 md:mb-12">
          <Badge className="mb-4">{post.categories[0]}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={post.author?.image}
                  alt={`${post.author?.name}'s profile`}
                />
                <AvatarFallback>{post.author?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{post.author?.name}</p>
              </div>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
              <span className="mr-3">{post.publishedAt.toString()}</span>
              <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
              <span>{post.readingTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <figure className="mb-10 rounded-xl overflow-hidden">
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
            <Image
              src={post.mainImage ? post.mainImage : "/placeholder.svg"}
              alt={post.title}
              fill
              sizes="(min-width: 1280px) 1200px, (min-width: 768px) 768px, 100vw"
              priority
              className="object-cover"
            />
          </div>
          <figcaption className="sr-only">{post.title}</figcaption>
        </figure>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          {/* Main Content - Client Component */}
          <ArticleContent
            content={post.content as any}
            tags={["ssss"]}
            author={post.author}
          />

          {/* Sidebar - Client Component */}
          <ArticleSidebar
            tableOfContents={tableOfContents}
            relatedPosts={relatedPosts}
          />
        </div>

        {/* Next/Previous Navigation - Client Component */}
        <ArticleNavigation prevPost={prevPost} nextPost={nextPost} />
      </main>

      {/* Scroll to Top Button - Client Component */}
      <ArticleActions />
    </div>
  );
}
