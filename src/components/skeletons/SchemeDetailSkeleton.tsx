import { Skeleton, SkeletonCircle } from "./SkeletonBase";

export default function SchemeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl space-y-6">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>

        {/* Fund Banner Skeleton */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SkeletonCircle size="w-16 h-16" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-64 sm:w-80 rounded-xl" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end space-y-1.5">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-9 w-32 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Chart Canvas Skeleton */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <div className="flex items-center gap-2">
              {["1M", "6M", "1Y", "3Y", "5Y", "ALL"].map((p) => (
                <Skeleton key={p} className="h-8 w-11 rounded-lg" />
              ))}
            </div>
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>

        {/* Fund Metrics 4-Col Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#0b1120]/70 border border-white/10 rounded-2xl p-4 space-y-2">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-6 w-28 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner Skeleton */}
        <Skeleton className="h-28 w-full rounded-3xl" />

      </div>
    </div>
  );
}
