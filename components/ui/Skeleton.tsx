export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/5 ${className}`}
      {...props}
    />
  )
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/2 p-6 space-y-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-3/4" />
    </div>
  )
}

export function LeadRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-white/5">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  )
}
