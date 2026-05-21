function Skeleton({ className = '' }) {
  return <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-52" />
        <Skeleton className="h-52 lg:col-span-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

export function GanttSkeleton() {
  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      <div className="space-y-1 shrink-0">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="card flex-1 overflow-hidden p-4 space-y-3">
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-5 w-20" />)}
        </div>
        <Skeleton className="h-8 w-full" />
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Skeleton className="h-6 w-64 shrink-0" />
            <Skeleton className="h-6 flex-1" style={{ marginLeft: `${i * 30}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-7 w-60" />
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-20" />)}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="card space-y-2">
          <div className="flex gap-3 items-center">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="p-6 space-y-5">
      <div className="space-y-1">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex gap-4 border-b border-slate-200 pb-0">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-44" />
      </div>
      <div className="card space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
    </div>
  );
}

// Generic full-page spinner — used as Suspense fallback
export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
      <svg className="w-10 h-10 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p className="text-sm font-medium text-slate-500">Cargando página...</p>
    </div>
  );
}
