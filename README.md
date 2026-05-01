# Lifting Diary

A workout logging application built with Next.js, Clerk authentication, and Neon Postgres (Drizzle ORM).

## Project Overview

Lifting Diary is a web application for tracking workouts. Users can create workout sessions, add exercises from a library, and log sets with weight and reps.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 |
| Auth | Clerk |
| Database | Neon Postgres |
| ORM | Drizzle ORM |
| Deployment | Vercel |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           Client                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Next.js    │  │  Clerk      │  │  Base UI + Tailwind     │  │
│  │  App Router │  │  Auth Flow  │  │  Components             │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
└─────────┼────────────────┼─────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Clerk Middleware (src/proxy.ts)             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database Layer                             │
│  ┌─────────────────┐    ┌─────────────────┐                   │
│  │  Neon Postgres  │    │  Drizzle ORM    │                   │
│  │  (serverless)   │◄──►│  (src/db/)      │                   │
│  └─────────────────┘    └─────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   exercises   │         │ workoutExercises │         │    sets      │
├──────────────┤         ├──────────────────┤         ├──────────────┤
│ id (PK)      │◄─────── │ id (PK)          │         │ id (PK)      │
│ name         │         │ workoutId (FK)   │┐        │ workoutExId  │
│ createdAt    │         │ exerciseId (FK)  ││        │ setNumber   │
│ updatedAt    │         │ order            ││        │ weight      │
└──────────────┘         │ createdAt        ││        │ reps        │
      ▲                  └──────────────────┘│        │ createdAt   │
      │                           ▲           │        └──────────────┘
      │                           │           │
      │                           │           │
┌──────────────┐         ┌──────────────────┘
│   workouts   │
├──────────────┤
│ id (PK)      │
│ userId (FK)  │ ──────► (Clerk user ID)
│ name         │
│ startedAt    │
│ completedAt  │
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

### Table Descriptions

**exercises** - Predefined exercise library
- `name` - Unique exercise name (e.g., "Bench Press", "Squat")

**workouts** - Individual workout sessions
- `userId` - Clerk authentication ID
- `name` - Workout name (e.g., "Push Day", "Leg Day")
- `startedAt` / `completedAt` - Workout timing

**workoutExercises** - Links exercises to workouts
- `workoutId` - References parent workout
- `exerciseId` - References exercise from library
- `order` - Display order within workout

**sets** - Individual sets within an exercise
- `workoutExerciseId` - References parent workout exercise
- `setNumber` - Set number (1, 2, 3...)
- `weight` / `reps` - Lifting data

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with ClerkProvider
│   ├── page.tsx            # Home page
│   ├── sign-in/           # Clerk sign-in route
│   └── sign-up/           # Clerk sign-up route
├── components/
│   └── AuthHeader.tsx      # App header with auth state
└── db/
    ├── index.ts            # Drizzle client + re-exports
    └── schema.ts           # Table definitions + relations
```

## Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://user:pass@host/db
```

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit push    # Push schema (dev)
npx drizzle-kit migrate # Apply migrations
```

## Authentication Flow

1. Unauthenticated users see sign-in/sign-up pages
2. Clerk handles authentication via OAuth
3. User ID from Clerk is stored in `workouts.userId`
4. Protected routes redirect to sign-in

## Database Relations

Drizzle relations enable eager loading:

```typescript
// Fetch workout with all exercises and sets
const result = await db.query.workouts.findFirst({
  where: eq(workouts.id, 1),
  with: {
    workoutExercises: {
      with: {
        exercise: true,
        sets: true
      }
    }
  }
})
```