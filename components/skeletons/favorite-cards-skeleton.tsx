"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const DoctorCardSkeleton = () => {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4">
          <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="text-center">
            <Skeleton className="h-5 w-3/4 mb-2 mx-auto" />
            <Skeleton className="h-4 w-1/2 mb-2 mx-auto" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};
