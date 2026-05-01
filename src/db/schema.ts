import { integer, pgTable, text, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

export const exercises = pgTable("exercises", {
  id: text().primaryKey().$defaultFn(() => nanoid()),
  name: text().notNull().unique(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: text().primaryKey().$defaultFn(() => nanoid()),
  userId: text().notNull(),
  name: text().notNull(),
  startedAt: timestamp(),
  completedAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const workoutExercises = pgTable("workoutExercises", {
  id: text().primaryKey().$defaultFn(() => nanoid()),
  workoutId: text().notNull().references(() => workouts.id),
  exerciseId: text().notNull().references(() => exercises.id),
  order: integer().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const sets = pgTable("sets", {
  id: text().primaryKey().$defaultFn(() => nanoid()),
  workoutExerciseId: text().notNull().references(() => workoutExercises.id),
  setNumber: integer().notNull(),
  weight: decimal({ precision: 10, scale: 2 }),
  reps: integer().notNull(),
  createdAt: timestamp().defaultNow(),
});

// Relations
export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));