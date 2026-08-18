import { Skeleton } from "@/src/components/skeleton/skeleton";

export const SkeletonDetails = () => {
  return (
    <div className="flex w-full flex-col gap-6 select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 !rounded-2xl" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48 !rounded-xl" />
              <Skeleton className="h-6 w-16 !rounded-full" />
            </div>
            <Skeleton className="h-4 w-64 !rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 !rounded-2xl" />
      </div>

      {/* Hero Bento Box & KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Media Banner Placeholder */}
        <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl animate-pulse lg:col-span-1 min-h-[220px]">
          <Skeleton className="h-36 w-full !rounded-2xl" />
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-4 w-24 !rounded-lg" />
            <Skeleton className="h-6 w-20 !rounded-full" />
          </div>
        </div>

        {/* Right: 4 Quick Stat KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-white/10 bg-primary/40 p-5 backdrop-blur-md shadow-xl animate-pulse min-h-[140px]"
            >
              <Skeleton className="h-4 w-20 !rounded-lg" />
              <Skeleton className="my-2 h-8 w-24 !rounded-xl" />
              <Skeleton className="h-3 w-28 !rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Details Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl animate-pulse space-y-4">
          <Skeleton className="h-5 w-40 !rounded-lg" />
          <div className="grid grid-cols-2 gap-4 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20 !rounded-md" />
                <Skeleton className="h-6 w-32 !rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl animate-pulse space-y-4">
          <Skeleton className="h-5 w-40 !rounded-lg" />
          <div className="grid grid-cols-2 gap-4 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20 !rounded-md" />
                <Skeleton className="h-6 w-32 !rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section Skeleton */}
      <div className="rounded-3xl border border-white/10 bg-primary/40 p-6 backdrop-blur-md shadow-2xl animate-pulse space-y-3">
        <Skeleton className="h-5 w-44 !rounded-lg" />
        <Skeleton className="h-20 w-full !rounded-2xl" />
      </div>
    </div>
  );
};
