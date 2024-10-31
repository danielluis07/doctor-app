import { Skeleton } from "@/components/ui/skeleton";

export const PatientPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 p-6 flex items-center justify-center bg-gray-200">
              <div className="relative w-48 h-48 rounded-full overflow-hidden">
                <Skeleton className="w-full h-full rounded-full" />
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                <Skeleton className="h-8 w-32" />
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      <Skeleton className="h-4 w-20" />
                    </p>
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      <Skeleton className="h-4 w-20" />
                    </p>
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      <Skeleton className="h-4 w-32" />
                    </p>
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      <Skeleton className="h-4 w-36" />
                    </p>
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <Skeleton className="h-6 w-48" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    <Skeleton className="h-4 w-24" />
                  </p>
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    <Skeleton className="h-4 w-24" />
                  </p>
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    <Skeleton className="h-4 w-36" />
                  </p>
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    <Skeleton className="h-4 w-36" />
                  </p>
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
