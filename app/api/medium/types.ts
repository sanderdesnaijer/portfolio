export interface MediumArticle {
  author: string;
  categories: string[];
  content: string;
  description: string;
  enclosure: Record<string, unknown>;
  guid: string;
  link: string;
  pubDate: string;
  thumbnail: string | null;
  title: string;
}
