"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout, deleteWorkout, getWorkoutById } from "@/data/helpers";
import { revalidatePath } from "next/cache";

const UpdateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
});

export type UpdateWorkoutInput = z.infer<typeof UpdateWorkoutSchema>;

export async function updateWorkoutAction(
  workoutId: string,
  data: UpdateWorkoutInput
) {
  const parsed = UpdateWorkoutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid workout data" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const existing = await getWorkoutById(workoutId, userId);
  if (!existing) {
    return { success: false, error: "Workout not found" };
  }

  try {
    await updateWorkout(workoutId, userId, parsed.data);
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/workout/${workoutId}`);
    return { success: true };
  } catch (e) {
    console.error("Workout update error:", e);
    return { success: false, error: "Failed to update workout" };
  }
}

export async function deleteWorkoutAction(workoutId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const existing = await getWorkoutById(workoutId, userId);
  if (!existing) {
    return { success: false, error: "Workout not found" };
  }

  try {
    await deleteWorkout(workoutId, userId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Workout delete error:", e);
    return { success: false, error: "Failed to delete workout" };
  }
}