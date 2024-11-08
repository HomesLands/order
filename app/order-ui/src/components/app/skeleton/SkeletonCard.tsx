import { Skeleton } from '@/components/ui'

export default function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      {/* Skeleton cho hình ảnh */}
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />

      {/* Skeleton cho text */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
