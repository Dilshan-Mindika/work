export type PortableTextBlock = {
  _type: "block";
  style: string; // e.g., "normal", "h1", "h2"
  _key: string;
  markDefs: Array<{
    _key: string;
    _type: string;
    [key: string]: unknown;
  }>; // Mark definitions for links and text styling
  children: {
    _key: string;
    _type: "span";
    text: string;
    marks: string[];
  }[];
};

export type Category = {
  value: string;
  label: string;
};

export type Posts = {
  _id: string;
  slug: string;
  categories: string[];
  readingTime: number;
  isFeatured: boolean;
  title: string;
  publishedAt: Date;
  mainImage: string;
  author: {
    name: string;
    image: string;
  };
  summary: string;
}[];

export type BlogArticle = {
  _id: string;
  slug: string;
  content: PortableTextBlock[]; // 🔹 Define content as an array of PortableTextBlock
  categories: string[];
  readingTime: number;
  isFeatured: boolean;
  title: string;
  publishedAt: Date;
  mainImage: string;
  author: {
    name: string;
    image: string;
  };
  summary: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  relatedPosts: string[];
};
