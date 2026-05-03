import { db } from "@/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { workouts } from "@/db/schema";

export async function getWorkoutsByDate(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, startOfDay),
      lte(workouts.startedAt, endOfDay)
    ),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: true,
        },
      },
    },
    orderBy: (workouts, { asc }) => [asc(workouts.startedAt)],
  });
}

export async function getWorkoutsByUser(userId: string) {
  return db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: true,
        },
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.startedAt)],
  });
}