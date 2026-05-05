import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getWorkoutsByDate } from "@/data/helpers";
import { DashboardCalendar } from "@/components/DashboardCalendar";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { userId } = await auth();
  const params = await searchParams;
  const today = new Date();
  const selectedDate = params.date
    ? new Date(params.date + "T00:00:00")
    : today;

  if (!userId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-center text-muted-foreground">
          Please sign in to view your workouts
        </p>
      </div>
    );
  }

  const workouts = await getWorkoutsByDate(userId, selectedDate);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>
              {format(selectedDate, "do MMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCalendar selectedDate={selectedDate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workouts</CardTitle>
            <CardDescription>
              Workouts logged for{" "}
              <span className="font-medium text-foreground">
                {format(selectedDate, "do MMM yyyy")}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No workouts logged for this date
              </div>
            ) : (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <Link
                    key={workout.id}
                    href={`/dashboard/workout/${workout.id}`}
                    className="block p-4 border rounded-lg bg-card hover:bg-accent transition-colors"
                  >
                    <h3 className="font-medium">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workout.startedAt
                        ? format(workout.startedAt, "h:mm a")
                        : "Not started"}
                      {workout.completedAt &&
                        ` - ${format(workout.completedAt, "h:mm a")}`}
                    </p>
                    {workout.workoutExercises.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        <p className="text-sm font-medium text-muted-foreground">Exercises</p>
                        {workout.workoutExercises.map((we) => (
                          <div key={we.id} className="p-2 border rounded bg-muted/50 text-sm">
                            <p className="font-medium">{we.exercise.name}</p>
                            <p className="text-muted-foreground">
                              {we.sets.length} set{we.sets.length !== 1 ? "s" : ""}
                              {we.sets[0]?.weight && ` • ${we.sets[0].weight} lbs`}
                              {we.sets[0]?.reps && ` x ${we.sets[0].reps} reps`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}