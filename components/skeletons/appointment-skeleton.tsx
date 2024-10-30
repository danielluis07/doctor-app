"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const AppointmentSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="w-full h-56" />
    </div>
  );
};
