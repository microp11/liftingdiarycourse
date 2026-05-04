import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWorkoutById } from "@/data/helpers";
import { EditWorkoutForm } from "./EditWorkoutForm";

interface PageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) {
    notFound();
  }

  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId, userId);

  if (!workout) {
    notFound();
  }

  return <EditWorkoutForm workout={workout} />;
}