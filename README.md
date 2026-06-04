# AccountaBuddy - Accountability Coach Platform

A mobile-first web app for coaches to manage challenges and track member progress.

## Quick Start

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role   | Email            | Password   |
|--------|-----------------|------------|
| Coach  | coach@demo.com  | coach123   |
| Member | member@demo.com | member123  |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite via Prisma
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

## Features

### Coach
- Dashboard with engagement stats
- Create/manage challenges with daily tasks
- View member progress and streaks
- Send quick encouragement messages
- Reminder center for announcements

### Member
- Home screen with active challenge & streak
- Daily check-in (tasks, weight, waist, water)
- Progress tracking with history
- Achievement badges & streak system

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, forgot password
│   ├── (dashboard)/     # Protected coach & member pages
│   └── api/             # REST API routes
├── components/          # Shared UI components
├── lib/                 # Auth, Prisma client
└── types/               # TypeScript declarations
```
