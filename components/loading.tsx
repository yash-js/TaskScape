import { Skeleton } from "@/components/ui/skeleton"

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

export const BoardLoadingSkeleton = () => (
  <div className="p-4 h-full overflow-x-auto">
    <div className="flex gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-80 bg-gray-100 rounded-lg p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="bg-white rounded p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const CardLoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
  </div>
)
