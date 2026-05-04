"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/helpers";
import { revalidatePath } from "next/cache";

export async function createWorkoutAction(
  data: { name: string; startedAt?: Date }
) {
  const CreateWorkoutSchema = z.object({
    name: z.string().min(1).max(255),
    startedAt: z.coerce.date().optional(),
  });

  const parsed = CreateWorkoutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid workout data" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const workout = await createWorkout(userId, parsed.data);
    revalidatePath("/dashboard");
    return { success: true, workoutId: workout[0]?.id };
  } catch (e) {
    console.error("Workout creation error:", e);
    return { success: false, error: "Failed to create workout" };
  }
}
