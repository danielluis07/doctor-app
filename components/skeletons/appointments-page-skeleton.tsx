import { Skeleton } from "@/components/ui/skeleton";

export const AppointmentPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white rounded-md shadow-lg">
      <div className="bg-blue-600 px-6 py-4">
        <h1 className="text-3xl font-bold text-white">
          <Skeleton className="h-8 w-48" />
        </h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col mb-4 gap-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-40" />

            <div className="flex flex-col gap-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-40" />

            <div className="flex flex-col gap-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    </div>
  );
};
