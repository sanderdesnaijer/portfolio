import { render, screen } from "@testing-library/react";
import Page from "./page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PageSanity } from "@/sanity/types";
import { mockPage } from "@/app/test-utils/mockPage";
import { BlogSanity } from "@/sanity/types/blogType";

const mockBlogPage: PageSanity = {
  ...mockPage,
  name: "Blog",
  title: "Blog",
  description: "Blog description",
  slug: {
    _type: "slug",
    current: "blog",
  },
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-123",
      _type: "reference",
    },
    alt: "Main image",
  },
  publishedAt: "2023-01-01",
  imageAlt: "Image alt text",
  imageURL: "https://example.com/image.jpg",
  _createdAt: "2023-01-01T00:00:00Z",
  _updatedAt: "2023-01-01T00:00:00Z",
};

const articles: BlogSanity[] = [
  {
    _id: "D9fCV9f59UZFiLIMN6Zg5d",
    publishedAt: "2023-10-01T12:00:00.000Z",
    imageURL: "/testimage.png",
    categories: [
      "sanity",
      "web-development",
      "frontend-development",
      "react",
      "nextjs",
    ],
    author: "Sander de Snaijer",
    title: "First Blog Post",
    slug: {
      current: "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
    },
    mediumUrl: "https://example.com/first-blog-post",
    description:
      '\n<figure><figcaption>homepage <a href="http://www.sanderdesnaijer.com/">www.sanderdesnaijer.com</a></figcaption></figure><blockquote>\n<em>I recently built my developer portfolio using </em><a href="http://www.sanderdesnaijer.com/"><em>Next.js and Sanity.</em></a><em> In this post, I’ll walk you through how I set it up — from design to deployment. You’ll find the source code linked at the bottom.</em>\n</blockquote>\n<p><strong>Intro</strong></p>\n<p>As a developer, having a portfolio is kind of a must. I had one for years, but at some point, I deleted it — and somehow never got around to making a new one. That’s partly because most of my work has been on internal projects as a consultant, so there wasn’t much I could actually share publicly. But honestly? Perfectionism also got in the way.</p>\n<p>I kept telling myself, “This has to be the best site I’ve ever made — with the cleanest design, coolest logo, and smoothest animations.” I started sketching ideas a few times, but never finished because I was never happy enough. This time, I took a different approach: just get it done. It didn’t need to be perfect — just good enough to be useful and live. That mindset helped a lot.</p>\n<p><strong>Why I picked Next.js</strong></p>\n<p>I built the site using Next.js for a few reasons:</p>\n<ul>\n<li>It does server-side rendering out of the box, which helps with SEO.</li>\n<li>I already knew React, but hadn’t worked much with Next.js — so it was a good excuse to learn.</li>\n<li>I wanted to use a headless CMS, and Sanity plays nicely with Next.js.</li>\n</ul>\n<p><strong>Starting the project</strong></p>\n<p>Everyone says “content is king,” and in my case, I didn’t have much to show since most of my work isn’t public. But I had done some side projects in my spare time — like a <a href="https://medium.com/@sanderdesnaijer/creating-a-3d-printed-word-clock-with-minute-accuracy-c8e0fd85bd16">word clock</a> and a <a href="https://medium.com/@sanderdesnaijer/building-my-first-flutter-app-challenges-and-lessons-learned-49ad913b4941">workout timer app</a>. I wrote blog posts about them on Medium, which gave me some material to use. I also had a few open-source repos that I could link. Piece by piece, it started to come together.</p>\n<p><strong>Design</strong></p>\n<p>I used Figma to design the site. It runs in the browser and feels familiar if you’ve used Illustrator or Photoshop. I started by defining the content first — knowing what needed to go on the page made designing a lot easier.</p>\n<p>I knew I wanted four pages: Home, Projects, Blog, and About. It took a few tries to land on something I liked, but once I had the basics, it was easier to build on. I also made mobile versions of the design early on, so I had a good sense of how things would look on different screens.</p>\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*oPR048C-XW26c69LTC3Dig.png"></figure><p>Some parts were tricky — like making a logo. I pushed that off until the end, hoping inspiration would strike. Also, during development, I often found myself going back to tweak the design or adjust things I missed. That back-and-forth is just part of the process, and it helped keep everything in sync.</p>\n<p><strong>GitHub Setup</strong></p>\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*RjBmZJSzVjVRkCP8CJq_gQ.png"><figcaption>pull requests linked to tickets</figcaption></figure>',
    _rev: "",
    _type: "",
    _createdAt: "",
    _updatedAt: "",
  },
  {
    _id: "F1fCV9f59UZFiLIMN6Zg5d",
    publishedAt: "2025-10-02T12:00:00.000Z",
    imageURL: "/testimage.png",
    categories: [
      "sanity",
      "web-development",
      "frontend-development",
      "react",
      "nextjs",
    ],
    author: "Sander de Snaijer",
    title: "Second Blog Post",
    slug: {
      current: "creating-a-headless-cms-portfolio-using-next-js-and-sanity",
    },
    mediumUrl: "https://example.com/second-blog-post",
    description:
      '\n<figure><figcaption>homepage <a href="http://www.sanderdesnaijer.com/">www.sanderdesnaijer.com</a></figcaption></figure><blockquote>\n<em>I recently built my developer portfolio using </em><a href="http://www.sanderdesnaijer.com/"><em>Next.js and Sanity.</em></a><em> In this post, I’ll walk you through how I set it up — from design to deployment. You’ll find the source code linked at the bottom.</em>\n</blockquote>\n<p><strong>Intro</strong></p>\n<p>As a developer, having a portfolio is kind of a must. I had one for years, but at some point, I deleted it — and somehow never got around to making a new one. That’s partly because most of my work has been on internal projects as a consultant, so there wasn’t much I could actually share publicly. But honestly? Perfectionism also got in the way.</p>\n<p>I kept telling myself, “This has to be the best site I’ve ever made — with the cleanest design, coolest logo, and smoothest animations.” I started sketching ideas a few times, but never finished because I was never happy enough. This time, I took a different approach: just get it done. It didn’t need to be perfect — just good enough to be useful and live. That mindset helped a lot.</p>\n<p><strong>Why I picked Next.js</strong></p>\n<p>I built the site using Next.js for a few reasons:</p>\n<ul>\n<li>It does server-side rendering out of the box, which helps with SEO.</li>\n<li>I already knew React, but hadn’t worked much with Next.js — so it was a good excuse to learn.</li>\n<li>I wanted to use a headless CMS, and Sanity plays nicely with Next.js.</li>\n</ul>\n<p><strong>Starting the project</strong></p>\n<p>Everyone says “content is king,” and in my case, I didn’t have much to show since most of my work isn’t public. But I had done some side projects in my spare time — like a <a href="https://medium.com/@sanderdesnaijer/creating-a-3d-printed-word-clock-with-minute-accuracy-c8e0fd85bd16">word clock</a> and a <a href="https://medium.com/@sanderdesnaijer/building-my-first-flutter-app-challenges-and-lessons-learned-49ad913b4941">workout timer app</a>. I wrote blog posts about them on Medium, which gave me some material to use. I also had a few open-source repos that I could link. Piece by piece, it started to come together.</p>\n<p><strong>Design</strong></p>\n<p>I used Figma to design the site. It runs in the browser and feels familiar if you’ve used Illustrator or Photoshop. I started by defining the content first — knowing what needed to go on the page made designing a lot easier.</p>\n<p>I knew I wanted four pages: Home, Projects, Blog, and About. It took a few tries to land on something I liked, but once I had the basics, it was easier to build on. I also made mobile versions of the design early on, so I had a good sense of how things would look on different screens.</p>\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*oPR048C-XW26c69LTC3Dig.png"></figure><p>Some parts were tricky — like making a logo. I pushed that off until the end, hoping inspiration would strike. Also, during development, I often found myself going back to tweak the design or adjust things I missed. That back-and-forth is just part of the process, and it helped keep everything in sync.</p>\n<p><strong>GitHub Setup</strong></p>\n<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*RjBmZJSzVjVRkCP8CJq_gQ.png"><figcaption>pull requests linked to tickets</figcaption></figure>',
    _rev: "",
    _type: "",
    _createdAt: "",
    _updatedAt: "",
  },
];

describe("app/(pages)/blog/page", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    (sanityFetch as jest.Mock).mockReset();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Page component with the correct structure", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(mockBlogPage)
      .mockResolvedValueOnce(articles);

    const { container } = render(await Page());

    const gridContainer = container.querySelector("div.grid");
    expect(gridContainer).toBeInTheDocument();
  });

  it("renders PageNotFound when page data is not found", async () => {
    (sanityFetch as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    render(await Page());

    expect(sanityFetch).toHaveBeenCalledWith({
      query: expect.any(String),
      params: { slug: "blog" },
    });
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
