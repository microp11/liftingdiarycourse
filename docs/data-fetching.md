# Data Fetching Standards

## Overview

This document outlines the data fetching standards for the Lifting Diary project. These rules are **critical** for security and maintainability.

## Server Components Only

**ALL data fetching MUST be done via React Server Components.** This is the only permitted approach.

### Forbidden Patterns

- **DO NOT** fetch data via Route Handlers (`app/api/*`)
- **DO NOT** fetch data via Client Components (`"use client"`)
- **DO NOT** use `useEffect` or similar client-side data fetching
- **DO NOT** use third-party data fetching libraries (SWR, React Query, etc.)

### Correct Pattern

```typescript
// pages/blog/[id]/page.tsx - Server Component
export default async function BlogPost({ params }: { params: { id: string } }) {
  const data = await getBlogPost(params.id);
  return <div>{data.title}</div>;
}
```

## Database Access

### Drizzle ORM Only

All database queries **MUST** use Drizzle ORM. **Raw SQL is strictly forbidden.**

### Helper Functions

Database operations must be performed through helper functions in the `/data` folder. These functions act as the single entry point for all database access.

```
/data
  /helpers.ts    # All database query functions
```

### Example Helper Function

```typescript
// data/helpers.ts
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { workouts, users } from "@/db/schema";

export async function getWorkoutById(workoutId: string, userId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}
```

## Data Isolation (Critical)

**Logged-in users MUST only be able to access their own data.** This is enforced at the database query level.

### Rules

1. **Every query that returns user data MUST include a user ID filter.**
2. **Never trust client-supplied user IDs.** Always use the user ID from the authenticated session.
3. **Cross-user data access is prohibited.** A user cannot access, view, or modify another user's data under any circumstances.

### Correct Implementation

```typescript
// ALWAYS include userId in the query filter
const workouts = await db.query.workouts.findMany({
  where: eq(workouts.userId, session.user.id),  // Filter by authenticated user
});
```

### Incorrect Implementation

```typescript
// NEVER do this - allows accessing other users' data
const workouts = await db.query.workouts.findMany({
  where: eq(workouts.id, workoutId),  // Missing userId filter!
});
```

## Session-Based Authentication

Use the authenticated session to obtain the current user's ID. Never accept a user ID from client-side code as the basis for data access decisions.