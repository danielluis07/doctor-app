"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const DoctorUserSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-0">
        <div className="lg:w-2/3 mt-8 lg:mt-0 lg:pl-12 space-y-6">
          <Skeleton className="mt-1 w-full h-24 rounded-md" />
          <Skeleton className="mt-1 w-full h-10 rounded-md" />
          <div>
            <div className="mt-2 space-x-6 flex">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
          </div>
          <Skeleton className="mt-1 w-full h-24 rounded-md" />
          <Skeleton className="mt-1 w-full h-10 rounded-md" />
          <Skeleton className="mt-1 w-full h-10 rounded-md" />
          <Skeleton className="w-24 h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
};
