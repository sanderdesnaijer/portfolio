# sanderdesnaijer.com

Personal portfolio and blog of **Sander de Snaijer**, a frontend developer from the Netherlands.

Built with Next.js, TypeScript, and Sanity CMS. The site showcases creative side projects — like face-controlled Tetris, webcam-based games, and 3D printing experiments — alongside writing about what I learn along the way.

Live at: [sanderdesnaijer.com](https://www.sanderdesnaijer.com)

## Tech Stack

- [Next.js](https://nextjs.org) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org) — type-safe JavaScript
- [Sanity](https://www.sanity.io) — headless CMS for content
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [Playwright](https://playwright.dev) — end-to-end testing
- [Jest](https://jestjs.io) — unit testing
- Deployed on [Vercel](https://vercel.com)

## Getting Started

Copy `.env.example` to `.env.local` and fill in the required values:
```bash
cp .env.example .env.local
```

Then run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

- `app/` — Next.js App Router pages and layouts
- `sanity/` — Sanity schema and studio config
- `e2e/` — Playwright end-to-end tests
- `messages/` — i18n translation files
- `public/` — static assets

## Environment Variables

See `.env.example` for all required variables. You'll need credentials for Sanity and any other connected services.

## License

MIT
