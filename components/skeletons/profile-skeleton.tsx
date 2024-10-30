"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex items-center p-6">
          <Skeleton className="w-24 h-24 rounded-full mr-6" />
          <div>
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-32 h-6 mb-1" />
            <Skeleton className="w-24 h-6" />
          </div>
        </div>
        <div className="p-6">
          <Skeleton className="w-full h-6 mb-4" />
          <Skeleton className="w-full h-4 mb-6" />
          <Skeleton className="w-full h-6 mb-4" />
          <Skeleton className="w-full h-4 mb-6" />
          <Skeleton className="w-full h-6 mb-4" />
          <Skeleton className="w-full h-4 mb-6" />
          <Skeleton className="w-full h-6 mb-4" />
          <Skeleton className="w-full h-4 mb-6" />
        </div>
        <div className="p-6 border-t border-gray-200">
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-48 h-4 mt-2" />
        </div>
      </div>
    </div>
  );
};
