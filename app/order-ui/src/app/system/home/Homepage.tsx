import { SkeletonCard } from '@/components/app/skeleton'
import { useDishes } from '@/hooks'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui'

export default function HomePage() {
  const { data, isLoading } = useDishes()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <p className="text-center">Không có dữ liệu món ăn</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Home page</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Render actual data sau khi load xong */}
        {data.map((dish) => (
          <div key={dish.id} className="flex flex-col p-4 space-y-3 border rounded-lg">
            <div className="h-[125px] w-full rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{dish.name}</h3>
              <p className="text-sm text-gray-500">{dish.description}</p>
              <p className="font-medium text-green-600">{dish.price.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
