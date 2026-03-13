import { Skeleton, CardSkeleton, LeadRowSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main Content Skeleton */}
      <div className="rounded-xl border border-white/5 bg-[#161b22] overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="divide-y divide-white/5">
          {[...Array(6)].map((_, i) => (
            <LeadRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
