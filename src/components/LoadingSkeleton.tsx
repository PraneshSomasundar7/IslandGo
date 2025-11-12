export function CardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-amber-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-amber-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-amber-200 rounded w-5/6"></div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-amber-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-amber-200 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-amber-200 rounded w-1/4"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-6 animate-pulse">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-amber-200 rounded w-1/4"></div>
              <div className="h-3 bg-amber-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-24 bg-amber-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-6 animate-pulse">
      <div className="h-6 bg-amber-200 rounded w-1/3 mb-6"></div>
      <div className="h-64 bg-amber-200 rounded"></div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 p-6">
      <div className="container mx-auto space-y-6">
        <div className="h-10 bg-amber-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}

