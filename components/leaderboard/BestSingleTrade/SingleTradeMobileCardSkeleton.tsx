import { Skeleton } from '@/components/ui/skeleton'

export const SingleTradeMobileCardSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-[#110C13] px-2.5 py-4">
      <div className="mb-2 flex items-start gap-3">
        <Skeleton className="h-8 w-8 flex-shrink-0 rounded-2xl" />

        <div className="min-w-0 flex-1">
          <Skeleton className="mb-1 h-3 w-16" />
        </div>

        <div className="flex flex-shrink-0 items-end gap-2">
          <div className="text-right">
            <Skeleton className="mb-1 h-3 w-12" />
          </div>

          <div className="mt-1 text-right">
            <Skeleton className="mb-1 h-3 w-12" />
          </div>
        </div>
      </div>

      <div className="mb-2.5 grid grid-cols-3 gap-4 rounded-md bg-[#1C131F] px-3.5 py-2.5">
        <div>
          <Skeleton className="mb-1 h-2.5 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>

        <div className="border-r border-l border-[#2A2033] px-4">
          <Skeleton className="mb-1 h-2.5 w-10" />
          <Skeleton className="h-3 w-12" />
        </div>

        <div>
          <Skeleton className="mb-1 h-2.5 w-16" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
