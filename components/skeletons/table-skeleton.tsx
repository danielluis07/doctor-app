import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = () => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center space-x-2">
        <Skeleton className="w-1/12 h-6" />
        <Skeleton className="w-2/12 h-6" />
        <Skeleton className="w-2/12 h-6" />
        <Skeleton className="w-1/12 h-6" />
        <Skeleton className="w-3/12 h-6" />
        <Skeleton className="w-2/12 h-6" />
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="w-1/12 h-8" />
            <Skeleton className="w-2/12 h-8" />
            <Skeleton className="w-2/12 h-8" />
            <Skeleton className="w-1/12 h-8" />
            <Skeleton className="w-3/12 h-8" />
            <Skeleton className="w-2/12 h-8" />
          </div>
        ))}
      </div>
    </div>
  );
};
