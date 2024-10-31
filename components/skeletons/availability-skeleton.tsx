"use client";

import { Skeleton } from "@/components/ui/skeleton";
export const AvailabilitySkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton className="h-32 max-w-2xl" />
      <div className="container mx-auto py-8 border rounded-xl mt-12">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};
