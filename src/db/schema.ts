import { integer, pgTable, text, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const exercises = pgTable("exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar(255).notNull().unique(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text().notNull(),
  name: varchar(255).notNull(),
  startedAt: timestamp(),
  completedAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const workoutExercises = pgTable("workoutExercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutId: integer().notNull().references(() => workouts.id),
  exerciseId: integer().notNull().references(() => exercises.id),
  order: integer().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const sets = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutExerciseId: integer().notNull().references(() => workoutExercises.id),
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

function varchar(_length: number) {
  return text();
}