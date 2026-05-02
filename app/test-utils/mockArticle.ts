import { BlogSanity } from "@/sanity/types/blogType";

let blockCounter = 0;

const createBlock = (text: string, style = "normal") => {
  const idx = ++blockCounter;
  return {
    _type: "block" as const,
    _key: `mock-block-${idx}`,
    style,
    children: [
      {
        _type: "span" as const,
        _key: `mock-span-${idx}`,
        text,
        marks: [] as string[],
      },
    ],
    markDefs: [],
  };
};

const createImageBlock = (alt: string) => ({
  _type: "image" as const,
  _key: `mock-image-block-${++blockCounter}`,
  asset: {
    _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-200x200-png",
    _type: "reference",
  },
  alt,
});

export const mockArticles: BlogSanity[] = [
  {
    title: "Mock Building My First Flutter App: Challenges and Lessons Learned",
    publishedAt: "2025-03-02T08:02:41",
    author: "Sander de Snaijer",
    excerpt:
      "Building my first Flutter app has been a nice experience, full of challenges, discoveries and learning moments. This post describes my journey from starting with zero mobile app development experience...",
    body: [
      createBlock(
        "Building my first Flutter app has been a nice experience, full of challenges, discoveries and learning moments. This post describes my journey from starting with zero mobile app development experience to launching an app to the Apple Store.",
        "h4"
      ),
      createImageBlock("Mock Tabata whip timer app store"),
      createBlock(
        "In 2022, I attended a software developer conference called Frontmania, where I was introduced to Flutter for the first time. The presenters demonstrated how Flutter enables easy app development for multiple platforms, including phones, tablets, and desktops."
      ),
      createBlock("Getting Started", "h3"),
      createBlock(
        "On November 4, 2024 I started with setting up the needed development tools and get to know Flutter and Dart. There are many good official and unofficial tutorials and guides to be found so I did not have much trouble setting everything up."
      ),
      createBlock("Key steps in development", "h3"),
      createBlock(
        "One of the first tasks was implementing navigation routes to manage the user flow between different screens."
      ),
      createImageBlock("Iterations of the start screen"),
      createBlock(
        "Design was an iterative process. I began with a simple, functional interface and refined it over time, improving layout, colours, and user interactions."
      ),
    ],
    tags: [],
    mainImage: {
      _type: "image",
      asset: {
        _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-200x200-png",
        _type: "reference",
      },
      alt: "Mock Tabata whip timer app store",
    },
    imageURL:
      "https://cdn.sanity.io/images/mock/production/mock-image.webp?w=1200&h=630&fit=crop&auto=format",
    _id: "mock-flutter-post",
    _rev: "",
    _type: "blogPost",
    _createdAt: "2025-03-02T08:02:41",
    _updatedAt: "2025-03-02T08:02:41",
    slug: {
      current:
        "mock-building-my-first-flutter-app-challenges-and-lessons-learned",
    },
    faq: [
      {
        _key: "faq-flutter-what",
        question: "What is Flutter?",
        answer: [
          createBlock(
            "Flutter is an open source UI toolkit by Google for building natively compiled applications for mobile, web, and desktop from a single codebase."
          ),
        ],
      },
      {
        _key: "faq-flutter-mac",
        question: "Do I need a Mac to develop Flutter apps?",
        answer: [
          createBlock(
            "You need a Mac to build and publish iOS apps, but you can develop Flutter apps for Android and web on Windows or Linux."
          ),
        ],
      },
    ],
    mediumUrl:
      "https://medium.com/@sanderdesnaijer/building-my-first-flutter-app-challenges-and-lessons-learned-49ad913b4941?source=rss-aae3af6fc2dd------2",
  },
  {
    title: "Mock Creating a 3D-Printed Word Clock with Minute Accuracy",
    publishedAt: "2025-02-02T08:02:41",
    author: "Sander de Snaijer",
    excerpt:
      "In my spare time, I created a word clock using Arduino. I designed it in Fusion 360 and printed it on the Bambu X1C. Many word clocks you find online have only 5-minute accuracy...",
    body: [
      createBlock(
        "In my spare time, I created a word clock using Arduino. I designed it in Fusion 360 and printed it on the Bambu X1C. Many word clocks you find online have only 5-minute accuracy, which I didn't like."
      ),
      createImageBlock(
        "Mock Completed Dutch Word Clock — Accurate to the Minute"
      ),
      createBlock("Prototyping in TypeScript", "h3"),
      createBlock(
        "Before starting the physical build, I planned everything out and created a prototype in TypeScript."
      ),
      createBlock("Electronics & Soldering", "h3"),
      createBlock(
        "After finalising the prototype, I moved on to the electronics. Since I was new to this, I debugged every step carefully."
      ),
    ],
    tags: [],
    slug: {
      current: "mock-creating-a-3d-printed-word-clock-with-minute-accuracy",
    },
    mainImage: {
      _type: "image",
      asset: {
        _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-200x200-png",
        _type: "reference",
      },
      alt: "Mock Completed Dutch Word Clock — Accurate to the Minute",
    },
    imageURL:
      "https://cdn.sanity.io/images/mock/production/mock-image2.webp?w=1200&h=630&fit=crop&auto=format",
    _id: "mock-wordclock-post",
    _rev: "",
    _type: "blogPost",
    _createdAt: "2025-02-02T08:02:41",
    _updatedAt: "2025-02-02T08:02:41",
    mediumUrl:
      "https://medium.com/@sanderdesnaijer/creating-a-3d-printed-word-clock-with-minute-accuracy-c8e0fd85bd16?source=rss-aae3af6fc2dd------2",
  },
];
