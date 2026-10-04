import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`bg-white/[0.05] border border-white/[0.05] rounded-xl animate-shimmer ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`h-4 bg-white/[0.05] rounded-md animate-shimmer ${className}`}
      {...props}
    />
  );
}

export function SkeletonCircle({ size = "w-10 h-10", className = "", ...props }: { size?: string } & SkeletonProps) {
  return (
    <div
      className={`${size} rounded-full bg-white/[0.05] border border-white/[0.05] animate-shimmer shrink-0 ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard({ className = "", children, ...props }: React.PropsWithChildren<SkeletonProps>) {
  return (
    <div
      className={`bg-[#0b1120]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
