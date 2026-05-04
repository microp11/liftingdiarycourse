"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { updateWorkoutAction, deleteWorkoutAction } from "./actions";

interface WorkoutExercise {
  id: string;
  exercise: {
    id: string;
    name: string;
  };
  sets: {
    id: string;
    weight: string | null;
    reps: number;
  }[];
}

interface Workout {
  id: string;
  name: string;
  startedAt: Date | null;
  completedAt: Date | null;
  workoutExercises: WorkoutExercise[];
}

interface EditWorkoutFormProps {
  workout: Workout;
}

export function EditWorkoutForm({ workout }: EditWorkoutFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate(formData: FormData) {
    setIsPending(true);
    setError(null);

    const name = formData.get("name") as string;
    const startedAt = formData.get("startedAt") as string;
    const completedAt = formData.get("completedAt") as string;

    const result = await updateWorkoutAction(workout.id, {
      name,
      startedAt: startedAt ? new Date(startedAt) : null,
      completedAt: completedAt ? new Date(completedAt) : null,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to update workout");
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this workout?")) {
      return;
    }

    setIsPending(true);
    setError(null);

    const result = await deleteWorkoutAction(workout.id);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to delete workout");
      setIsPending(false);
    }
  }

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Workout</CardTitle>
          <CardDescription>Update your workout session</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Upper Body, Leg Day"
                defaultValue={workout.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startedAt">Start Time</Label>
              <Input
                id="startedAt"
                name="startedAt"
                type="datetime-local"
                defaultValue={formatDateForInput(workout.startedAt)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completedAt">End Time</Label>
              <Input
                id="completedAt"
                name="completedAt"
                type="datetime-local"
                defaultValue={formatDateForInput(workout.completedAt)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="ml-auto"
              >
                Delete
              </Button>
            </div>
          </form>

          {workout.workoutExercises.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Exercises</h3>
              <div className="space-y-4">
                {workout.workoutExercises.map((we) => (
                  <div key={we.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{we.exercise.name}</p>
                    {we.sets.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {we.sets.length} set{we.sets.length !== 1 ? "s" : ""}
                        {we.sets[0]?.weight &&
                          ` • ${we.sets[0].weight} lbs`}
                        {we.sets[0]?.reps && ` x ${we.sets[0].reps} reps`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}