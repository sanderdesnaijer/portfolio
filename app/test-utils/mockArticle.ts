import { MediumArticle } from "../api/medium/types";

export const mockArticles: MediumArticle[] = [
  {
    title: "Exploring the Cosmos with a Telescope",
    pubDate: "2025-03-15 08:30:00",
    link: "https://medium.com/@jane_doe/exploring-the-cosmos-with-a-telescope-xyz123?source=rss-xyz123------1",
    guid: "https://medium.com/p/xyz123",
    author: "Jane Doe",
    thumbnail: "",
    description:
      "<p>Discover the wonders of the universe with a telescope. This guide will help you get started with stargazing and understanding celestial objects.</p><img src='https://nonexistent-image-url.com/telescope.jpeg' alt='Telescope Setup'>",
    content:
      "In this article, we explore the basics of using a telescope to observe stars, planets, and other celestial bodies. Learn about different types of telescopes and how to choose the right one for your needs.",
    categories: ["astronomy", "stargazing"],
    enclosure: {},
  },
  {
    title: "Mastering TypeScript for Web Development",
    pubDate: "2025-04-22 14:45:00",
    link: "https://medium.com/@alex_smith/mastering-typescript-for-web-development-abc456?source=rss-abc456------2",
    guid: "https://medium.com/p/abc456",
    author: "Alex Smith",
    thumbnail: "",
    description:
      "<p>TypeScript is a powerful tool for building robust web applications. This article covers the essentials of TypeScript and how to integrate it into your projects.</p><img src='https://nonexistent-image-url.com/typescript.jpeg' alt='TypeScript Logo'>",
    content:
      "This comprehensive guide covers the key features of TypeScript, including type annotations, interfaces, and advanced types. Learn how to leverage TypeScript to improve your web development workflow.",
    categories: ["typescript", "web development"],
    enclosure: {},
  },
];
