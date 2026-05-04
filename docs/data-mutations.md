# Data Mutation Standards

## Overview

This document outlines the data mutation standards for the Lifting Diary project. These rules are **critical** for security, type safety, and maintainability.

## Core Principles

1. **All data mutations MUST use Drizzle ORM** — raw SQL is strictly forbidden.
2. **All data mutations MUST be performed via helper functions** in the `/data` directory.
3. **All data mutations MUST be performed via Server Actions** in colocated `actions.ts` files.
4. **All server action parameters MUST be typed** — `FormData` is not permitted.
5. **All server actions MUST validate inputs with Zod.**

## Directory Structure

```
/data
  /helpers.ts    # All database query and mutation helper functions

/src/app/[feature]
  /actions.ts   # Server actions for that feature (colocated with page components)
```

## Step 1: Database Helper Functions

All database mutations must be performed through helper functions in `src/data/helpers.ts`.

### Rules

- Helper functions serve as the **single entry point** for all database write operations.
- Helper functions must use Drizzle ORM for all database operations.
- Helper functions must accept typed parameters (never accept raw user input without validation).
- Helper functions must enforce data isolation — always include `userId` in where clauses.

### Example

```typescript
// src/data/helpers.ts
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, data: CreateWorkoutInput) {
  return db
    .insert(workouts)
    .values({
      userId,
      name: data.name,
      startedAt: data.startedAt,
    })
    .returning();
}

export async function updateWorkout(
  workoutId: string,
  userId: string,
  data: UpdateWorkoutInput
) {
  return db
    .update(workouts)
    .set(data)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
}

export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Step 2: Server Actions

All data mutations must be performed through Server Actions in colocated `actions.ts` files.

### File Naming

Server actions **MUST** be placed in a file named `actions.ts` colocated with the feature they belong to.

```
src/app/workouts/[id]/page.tsx     # Page component
src/app/workouts/[id]/actions.ts   # Server actions for workouts
```

### Rules

- Server actions **MUST** be async functions using the `"use server"` directive.
- Server action parameters **MUST** be typed — `FormData` is not allowed.
- Server actions **MUST** validate all inputs with Zod before passing to helper functions.
- Server actions must extract `userId` from the authenticated session, never from client input.
- Server actions must enforce ownership checks before performing mutations.

### Parameter Typing

**Always use typed parameters, never `FormData`:**

```typescript
// Correct
export async function updateWorkoutAction(
  workoutId: string,
  data: { name: string; startedAt: Date }
) {
  "use server";
  // ...
}

// Incorrect - FormData is not allowed
export async function updateWorkoutAction(formData: FormData) {
  "use server";
  // ...
}
```

### Zod Validation

All server actions **MUST** validate inputs with Zod schemas:

```typescript
// src/app/workouts/[id]/actions.ts
import { z } from "zod";
import { updateWorkout } from "@/data/helpers";
import { auth } from "@/lib/auth";

const UpdateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(
  workoutId: string,
  data: z.infer<typeof UpdateWorkoutSchema>
) {
  "use server";

  // Validate input
  const parsed = UpdateWorkoutSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  // Get authenticated user
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Perform mutation (helper enforces userId)
  await updateWorkout(workoutId, session.user.id, parsed.data);
}
```

## Data Isolation (Critical)

**Logged-in users MUST only be able to mutate their own data.** This is enforced at multiple levels:

1. Helper functions include `userId` in where clauses.
2. Server actions get `userId` from the authenticated session, never from client input.
3. Ownership is verified before mutations.

### Correct Implementation

```typescript
// Helper enforces userId filter
export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

// Server action gets userId from session
export async function deleteWorkoutAction(workoutId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await deleteWorkout(workoutId, session.user.id);  // Always passes userId
}
```

### Incorrect Implementation

```typescript
// NEVER accept userId from client
export async function deleteWorkoutAction(workoutId: string, userId: string) {
  // SECURITY BUG: client can pass any userId!
  await deleteWorkout(workoutId, userId);
}
```

## Error Handling

Server actions should return meaningful errors and handle validation failures gracefully:

```typescript
export async function createWorkoutAction(
  data: CreateWorkoutInput
): Promise<{ success: boolean; error?: string; workout?: Workout }> {
  "use server";

  const parsed = CreateWorkoutSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid workout data",
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const workout = await createWorkout(session.user.id, parsed.data);
    return { success: true, workout };
  } catch {
    return { success: false, error: "Failed to create workout" };
  }
}
```

## Type Exports

Export Zod schemas and types from the same file as the actions for use by client components:

```typescript
// src/app/workouts/[id]/actions.ts
import { z } from "zod";

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  startedAt: z.coerce.date(),
});

export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;
```

Client components can then import the schema for form validation:

```typescript
// src/app/workouts/new/page.tsx
import { CreateWorkoutSchema } from "./actions";
// Use in form validation...
```
