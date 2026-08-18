import { Skeleton } from "@/src/components/skeleton/skeleton";

export const SkeletonTable = () => {
  return (
    <div className="flex w-full flex-col gap-6 select-none">
      {/* Header & Filter Action Bar Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 !rounded-xl" />
          <Skeleton className="h-4 w-64 !rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 !rounded-2xl" />
      </div>

      {/* Search Filters Capsule Skeleton */}
      <div className="rounded-3xl border border-white/10 bg-primary/40 p-4 backdrop-blur-md shadow-xl animate-pulse">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-10 w-72 !rounded-2xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32 !rounded-2xl" />
            <Skeleton className="h-10 w-24 !rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Main Table Bento Container Skeleton */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl animate-pulse">
        {/* Table Header Row */}
        <div className="grid grid-cols-5 gap-4 border-b border-white/10 pb-4">
          <Skeleton className="h-5 w-full !rounded-lg" />
          <Skeleton className="h-5 w-full !rounded-lg" />
          <Skeleton className="h-5 w-full !rounded-lg" />
          <Skeleton className="h-5 w-full !rounded-lg" />
          <Skeleton className="h-5 w-full !rounded-lg" />
        </div>

        {/* 5 Pulsing Table Rows */}
        <div className="divide-y divide-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 py-4 items-center">
              <Skeleton className="h-6 w-3/4 !rounded-xl" />
              <Skeleton className="h-6 w-2/3 !rounded-xl" />
              <Skeleton className="h-6 w-full !rounded-xl" />
              <Skeleton className="h-6 w-1/2 !rounded-xl" />
              <div className="flex justify-end">
                <Skeleton className="h-8 w-8 !rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
