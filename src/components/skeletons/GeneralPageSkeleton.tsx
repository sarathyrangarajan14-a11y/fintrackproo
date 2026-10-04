import { Skeleton } from "./SkeletonBase";

export default function GeneralPageSkeleton({ titleWidth = "w-64" }: { titleWidth?: string }) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl space-y-6">
        
        {/* Title and subtitle */}
        <div className="space-y-2">
          <Skeleton className={`h-8 ${titleWidth} rounded-xl`} />
          <Skeleton className="h-4 w-80 max-w-full rounded-lg" />
        </div>

        {/* Primary Content Container */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
}
