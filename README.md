# Tennis League

A modern Next.js app for managing a double round-robin tennis league.

## Features

- Admin-managed players, with no hardcoded names
- Automatic double round-robin fixture generation
- Admin-only result entry, editing, and deletion
- Dynamic standings calculated from match results
- Points system:
  - 2:0 winner gets 3 points, loser gets 0.5
  - 2:1 winner gets 3 points, loser gets 1
- Tie-breakers:
  - Total points
  - Sets won
  - Head-to-head among tied players
  - Fewer sets lost
- Public dashboard with standings, recent matches, and league stats
- Public match history
- Responsive admin panel for phone, tablet, and desktop

## Tech Stack

- Next.js App Router
- Prisma ORM
- SQLite for local development
- PostgreSQL-ready for production
- iron-session for password-based admin login
- Tailwind CSS
- Vitest

## Local Setup

```bash
npm install
npm run prisma:migrate
npm run dev
```

Open `http://localhost:3000`.

Admin login is at `http://localhost:3000/admin/login`.

The local `.env` created during development uses:

```bash
ADMIN_PASSWORD="admin123"
```

Change `ADMIN_PASSWORD` and `SESSION_SECRET` before deploying.

## Database

Local development uses SQLite:

```bash
DATABASE_URL="file:./dev.db"
```

For Vercel, use a hosted PostgreSQL database such as Neon or Railway and set:

```bash
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="your-strong-admin-password"
SESSION_SECRET="at-least-32-random-characters"
```

Run production migrations with:

```bash
npm run prisma:deploy
```

## Useful Commands

```bash
npm run dev
npm run lint
npm test
npm run build
npm run prisma:migrate
npm run prisma:deploy
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
