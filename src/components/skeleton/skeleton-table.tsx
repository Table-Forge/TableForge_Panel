import { Skeleton } from "@/src/components/skeleton/skeleton";

export const SkeletonTable = () => {
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="grid grid-cols-5 gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-52 w-full rounded-lg" />
    </div>
  );
};
