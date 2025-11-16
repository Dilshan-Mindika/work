"use client";

import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";

interface ArticleContentProps {
  content: any[];
  tags?: string[];
  author: {
    name: string;
    image: string;
  };
}

export default function ArticleContent({
  content,
  tags,
  author,
}: ArticleContentProps) {
  const components = {
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold mt-4 mb-2">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-semibold mt-4 mb-2">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-medium mt-3 mb-2">{children}</h3>
      ),
      normal: ({ children }: any) => (
        <p className="text-lg leading-7 mb-4">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-bold ">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic text-gray-700">{children}</em>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          className="text-blue-600 underline hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
      number: ({ children }: any) => <li className="ml-4">{children}</li>,
    },
    types: {
      image: ({ value }: any) => (
        <img
          src={value.asset.url}
          alt={value.alt || "Image"}
          className="w-full rounded-lg shadow-lg"
        />
      ),
    },
  };
  return (
    <article id="article-content mx-10">
      <motion.div
        className="prose prose-zinc space-y-10 dark:prose-invert max-w-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <PortableText components={components} value={content} />

      {/* Tags */}
      {/* {tags && tags.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-medium mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )} */}

      {/* Author Bio */}
      {/* {author?.bio && (
        <motion.div
          className="mt-10 p-6 border rounded-xl bg-muted/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={author.avatar}
                alt={`${author.name}'s profile`}
              />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">About {author.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {author.role}
              </p>
              <p className="text-sm">{author.bio}</p>
            </div>
          </div>
        </motion.div>
      )} */}
    </article>
  );
}
