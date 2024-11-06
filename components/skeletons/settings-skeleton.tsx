"use client";

import { Skeleton } from "../ui/skeleton";

export const SettingsSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-64 h-7" />
      <Skeleton className="size-40 mt-8" />
      <div className="mt-10 space-y-10">
        <Skeleton className="w-2/6 h-10" />
        <Skeleton className="w-2/6 h-10" />
        <Skeleton className="w-2/6 h-10" />
        <Skeleton className="w-2/6 h-10" />
        <Skeleton className="w-1/6 h-10" />
      </div>
    </div>
  );
};
