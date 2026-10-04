import { Skeleton, SkeletonCircle } from "./SkeletonBase";

export default function PartnerDashboardSkeleton() {
  return (
    <div className="flex-1 min-h-screen bg-[#020617] text-slate-200 p-6 sm:p-8 space-y-6">
      {/* Partner Top Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-44 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* 4 Partner KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <SkeletonCircle size="w-8 h-8" />
            </div>
            <Skeleton className="h-8 w-32 rounded-xl" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        ))}
      </div>

      {/* Partner Quick Action & Alerts Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0b1120]/80 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <SkeletonCircle size="w-10 h-10" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0b1120]/80 border border-white/10 rounded-3xl p-6 space-y-4">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
