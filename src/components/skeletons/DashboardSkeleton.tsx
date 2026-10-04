import { Skeleton, SkeletonCircle } from "./SkeletonBase";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-16">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl space-y-6">
        
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-44 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32 rounded-xl hidden sm:block" />
            <Skeleton className="h-11 w-36 rounded-2xl" />
          </div>
        </div>

        {/* Live Market Ticker Skeleton */}
        <Skeleton className="h-11 w-full rounded-2xl" />

        {/* Hero Portfolio Balance Card */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-10 sm:h-12 w-60 rounded-2xl" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-4 w-36 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-6 w-28 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-6 w-28 rounded-lg" />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-6 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0b1120]/70 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded" />
                <SkeletonCircle size="w-8 h-8" />
              </div>
              <Skeleton className="h-8 w-36 rounded-xl" />
              <Skeleton className="h-3 w-40 rounded" />
            </div>
          ))}
        </div>

        {/* Portfolio Holdings & Active SIPs Table */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-3.5">
                  <SkeletonCircle size="w-11 h-11" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48 sm:w-64 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end space-y-1.5">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
