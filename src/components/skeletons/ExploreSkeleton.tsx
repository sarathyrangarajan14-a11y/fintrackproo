import { Skeleton, SkeletonCircle } from "./SkeletonBase";

export default function ExploreSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl space-y-6">
        
        {/* Page Title & Subtitle */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Skeleton className="h-11 w-full md:w-96 rounded-xl" />
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-9 w-24 sm:w-28 rounded-xl shrink-0" />
          ))}
        </div>

        {/* Mutual Fund Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <div className="flex items-start gap-3">
                <SkeletonCircle size="w-12 h-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-5 w-24 rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-5 w-20 rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <Skeleton className="h-9 rounded-xl" />
                <Skeleton className="h-9 rounded-xl" />
                <Skeleton className="h-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
