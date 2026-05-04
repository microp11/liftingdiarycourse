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
import { createWorkoutAction } from "./actions";

export default function NewWorkoutPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const name = formData.get("name") as string;
    const startedAt = formData.get("startedAt") as string;

    const result = await createWorkoutAction({
      name,
      startedAt: startedAt ? new Date(startedAt) : undefined,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to create workout");
      setIsPending(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Workout</CardTitle>
          <CardDescription>Log a new workout session</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Upper Body, Leg Day"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startedAt">Start Time (optional)</Label>
              <Input
                id="startedAt"
                name="startedAt"
                type="datetime-local"
              />
              <p className="text-sm text-muted-foreground">
                Leave blank to create workout without a start time
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Workout"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
