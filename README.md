# sanderdesnaijer.com

[![Live Site](https://img.shields.io/badge/live-sanderdesnaijer.com-blue)](https://www.sanderdesnaijer.com)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![CMS](https://img.shields.io/badge/CMS-Sanity-red)](https://www.sanity.io)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-black)](https://vercel.com)

Personal portfolio and blog of **Sander de Snaijer**, a frontend developer from the Netherlands with 10+ years of experience.

This site is where code meets creativity: webcam-controlled browser games built with MediaPipe, 3D printing experiments with resin and Arduino, Flutter apps on the App Store, and tutorials about all of it. Built as a fully SEO-optimized Next.js application with structured data, dynamic sitemaps, and tag-based content hubs.

**Live at:** [www.sanderdesnaijer.com](https://www.sanderdesnaijer.com)

## What's on the site

- **Projects** / face-controlled Tetris, webcam Duck Hunt with hand tracking, a 3D-printed Arduino word clock, a multi-language Sudoku app, geospatial weather tools, and more
- **Blog** / step-by-step guides on 3D printing with resin, MediaPipe hand and face tracking in the browser, building with Next.js and Sanity, Flutter app development, and creative coding
- **Tags** / 50+ topic pages that group projects and articles by technology (React, Flutter, MediaPipe, Arduino, 3D printing, etc.)

## Tech stack

- **[Next.js 16](https://nextjs.org)** / App Router, static generation with ISR, dynamic metadata
- **[TypeScript](https://www.typescriptlang.org)** / end-to-end type safety
- **[Sanity](https://www.sanity.io)** / headless CMS with real-time previews and structured content
- **[Tailwind CSS](https://tailwindcss.com)** / utility-first styling
- **[Playwright](https://playwright.dev)** / end-to-end testing
- **[Jest](https://jestjs.io)** / unit testing
- **[Vercel](https://vercel.com)** / deployment with preview branches

## SEO features

- JSON-LD structured data (BlogPosting, FAQPage, Person, WebSite, BreadcrumbList, SoftwareApplication)
- Open Graph and Twitter Card meta tags with optimized images
- Dynamic sitemap generation
- Tag hub pages with unique descriptions and intro content
- Content-first title strategy for better SERP click-through rates
- FAQ schema on blog posts for rich result eligibility

## Getting started

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project structure

```
app/           Next.js App Router pages, components, and utilities
sanity/        Sanity schema definitions and studio config
e2e/           Playwright end-to-end tests
messages/      i18n translation files
public/        Static assets and favicons
redirects/     Blog redirect mappings (old Medium slugs)
scripts/       Build and migration scripts
```

## Environment variables

See `.env.example` for all required variables. You'll need credentials for Sanity, Vercel, and Google site verification.

## Exporting blog posts to dev.to

Export a blog post from Sanity to dev.to-compatible markdown:

```bash
npm run export:devto -- <slug>
```

List all available blog post slugs:

```bash
npm run export:devto
```

The exported markdown file lands in `scripts/devto-exports/<slug>.md` with frontmatter, cover image, tags, and canonical URL pre-filled. Review the content and paste into [dev.to/new](https://dev.to/new). Set `published: true` when ready to go live.

## IndexNow

The site supports [IndexNow](https://www.indexnow.org/) for instant URL submission to Bing, Yandex, and other participating search engines. The verification key is served from `public/`.

Submit all pages from the sitemap:

```bash
node scripts/indexnow.mjs
```

Submit specific URLs after publishing new content:

```bash
node scripts/indexnow.mjs https://sanderdesnaijer.com/blog/my-new-post
```

Run once per publish. Don't resubmit the same URLs repeatedly.

## License

MIT
