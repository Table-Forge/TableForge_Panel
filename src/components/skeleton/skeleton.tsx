import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className = "", ...props }: SkeletonProps) => {
  return <div className={`animate-pulse rounded-md bg-white/10 ${className}`} {...props} />;
};
