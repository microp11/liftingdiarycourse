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
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      params.set("date", `${year}-${month}-${day}`);
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