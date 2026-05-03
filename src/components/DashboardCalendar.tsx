"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { useCallback } from "react";

interface DashboardCalendarProps {
  selectedDate: Date;
}

export function DashboardCalendar({ selectedDate }: DashboardCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", date.toISOString().split("T")[0]);
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      className="rounded-md border"
    />
  );
}