import { Skeleton } from "@/components/ui/skeleton";

export const MainSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="col-span-1 lg:col-span-2" />
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <Skeleton className="w-1/2 h-7 mb-4" />
          <div className="flex flex-col space-y-3 md:space-y-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="col-span-1 h-36" />

        <Skeleton className="col-span-1 h-36" />
      </div>
    </div>
  );
};
