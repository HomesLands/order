import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui'

import { Button } from '@/components/ui'
import { useOrders, usePagination } from '@/hooks'
import { useUserStore } from '@/stores'
import { publicFileURL, ROUTE } from '@/constants'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
import { OrderStatus } from '@/types'
import { OrderHistorySkeleton } from '@/components/app/skeleton'
import { formatCurrency } from '@/utils'

export default function CustomerOrderTabsContent({
  status,
}: {
  status: OrderStatus
}) {
  const { t } = useTranslation(['menu'])
  const navigate = useNavigate()
  const { userInfo } = useUserStore()
  const { pagination, handlePageChange } = usePagination()

  const { data: order, isLoading } = useOrders({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    hasPaging: true,
    status: status,
  })

  const orderData = order?.result.items

  if (isLoading) {
    return <OrderHistorySkeleton />
  }

  return (
    <div className="mb-4">
      {orderData?.length ? (
        orderData.map((orderItem) => (
          <div key={orderItem.slug} className="mb-6 border rounded-md">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b rounded-t-md">
              <span className="text-xs text-muted-foreground">
                {moment(orderItem.createdAt).format('hh:mm:ss DD/MM/YYYY')}
              </span>

              <OrderStatusBadge order={orderItem} />
            </div>

            {/* Order items */}
            <div className="flex flex-col">
              {orderItem.orderItems.map((product) => (
                <div
                  key={product.slug}
                  className="grid items-center grid-cols-12 gap-2 p-4"
                >
                  <div className="relative col-span-3">
                    <img
                      src={`${publicFileURL}/${product.variant.product.image}`}
                      alt={product.variant.product.name}
                      className="object-cover w-20 h-20 rounded-md sm:w-36"
                    />
                    <div className="absolute flex items-center justify-center text-xs text-white rounded-full -bottom-2 -right-3 sm:right-4 h-7 w-7 bg-primary sm:h-8 sm:w-8">
                      x{product.quantity}
                    </div>
                  </div>

                  <div className="flex flex-col col-span-6 gap-1 px-1">
                    <div className="text-sm font-semibold truncate sm:text-md">
                      {product.variant.product.name}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {product.variant.size.name.toLocaleUpperCase()} -{' '}
                      {`${formatCurrency(product.variant.price)}`}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span>
                      {`${formatCurrency(product.variant.price * product.quantity)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-end gap-2 p-4">
              <div className="flex items-center justify-between">
                <Button
                  onClick={() =>
                    navigate(`${ROUTE.CLIENT_ORDER_HISTORY}/${orderItem.slug}`)
                  }
                >
                  {t('order.viewDetail')}
                </Button>
                <div>
                  {t('order.subtotal')}:&nbsp;
                  <span className="font-semibold text-md text-primary sm:text-2xl">{`${formatCurrency(orderItem.subtotal)}`}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center">{t('order.noOrders')}</div>
      )}

      {orderData && orderData?.length > 0 && (
        <div className="flex items-center justify-center py-4 space-x-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.pageIndex - 1)}
                  className={
                    !order?.result.hasPrevious
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>{order?.result.page}</PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.pageIndex + 1)}
                  className={
                    !order?.result.hasNext
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
