import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleAlert } from 'lucide-react'

import {
  CustomerInformation,
  OrderItemList,
} from '@/app/system/order-management'
import { useOrderBySlug, useOrders, usePagination } from '@/hooks'
import { useOrderTrackingStore, useUserStore } from '@/stores'
import { IOrder, IOrderType, OrderStatus } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
} from '@/components/ui'
import {
  CreateOrderTrackingByStaffDialog,
  CreateOrderTrackingByRobotDialog,
} from '@/components/app/dialog'

interface IOrderItemDetailSheetProps {
  order: string
  isOpen: boolean
  onClose: () => void
}

export default function OrderItemDetailSheet({
  order,
  isOpen,
  onClose,
}: IOrderItemDetailSheetProps) {
  const { t: tCommon } = useTranslation(['common'])
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { pagination } = usePagination()
  const [shouldFetchOrders, setShouldFetchOrders] = useState(false)
  const [orderSlugs, setOrderSlugs] = useState<string[]>([])
  const [orderDetails, setOrderDetails] = useState<IOrder[]>([])
  const [currentFetchIndex, setCurrentFetchIndex] = useState(0)
  const { getSelectedItems } = useOrderTrackingStore()

  // Polling: Order chính
  const { data: selectedOrder, refetch: refetchSelectedOrder } = useOrderBySlug(
    order,
    {
      enabled: !!order,
    },
  )

  useEffect(() => {
    if (!order) return
    const interval = setInterval(async () => {
      try {
        await refetchSelectedOrder()
      } catch (error) {
        console.error('Error polling main order:', error)
      }
    }, 5000) // Polling mỗi 5 giây

    return () => clearInterval(interval) // Cleanup
  }, [order, refetchSelectedOrder])

  // Lấy danh sách orders cùng bàn
  const { data: ordersInTheSameTable, refetch: allOrderRefetch } = useOrders({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
    table: selectedOrder?.result?.table?.slug,
    hasPaging: false,
    enabled: shouldFetchOrders && !!selectedOrder?.result?.table?.slug,
    status: [OrderStatus.PAID, OrderStatus.SHIPPING, OrderStatus.FAILED].join(
      ',',
    ),
  })

  useEffect(() => {
    const slugs =
      ordersInTheSameTable?.result?.items?.map((item) => item.slug) || []
    setOrderSlugs(slugs)
  }, [ordersInTheSameTable])

  // Update orderDetails when ordersInTheSameTable changes
  // useEffect(() => {
  //   if (ordersInTheSameTable?.result?.items) {
  //     setOrderDetails(ordersInTheSameTable.result.items)
  //   }
  // }, [ordersInTheSameTable])

  // Fetch từng order từ danh sách orders cùng bàn
  const { data: currentOrderDetail } = useOrderBySlug(
    shouldFetchOrders && orderSlugs[currentFetchIndex]
      ? orderSlugs[currentFetchIndex]
      : '',
    {
      enabled:
        shouldFetchOrders &&
        currentFetchIndex < orderSlugs.length &&
        orderSlugs[currentFetchIndex] !== order,
    },
  )

  useEffect(() => {
    if (currentOrderDetail?.result) {
      setOrderDetails((prev) => {
        const exists = prev.some(
          (detail) => detail.slug === currentOrderDetail.result.slug,
        )
        if (!exists) {
          return [...prev, currentOrderDetail.result]
        }
        return prev.map((detail) =>
          detail.slug === currentOrderDetail.result.slug
            ? currentOrderDetail.result
            : detail,
        )
      })

      setCurrentFetchIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        return nextIndex < orderSlugs.length ? nextIndex : prevIndex
      })
    }
  }, [currentOrderDetail, orderSlugs.length])

  const handleFetchOrders = () => {
    setShouldFetchOrders(true)
    setOrderDetails([])
    setCurrentFetchIndex(0)
  }

  const handleRefetchAll = async () => {
    setOrderDetails([])
    setCurrentFetchIndex(0)
    await allOrderRefetch()
  }

  useEffect(() => {
    if (!shouldFetchOrders) return

    const interval = setInterval(async () => {
      try {
        await allOrderRefetch()
      } catch (error) {
        console.error('Error during polling orders:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [shouldFetchOrders, allOrderRefetch])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] overflow-y-auto p-2">
        <SheetHeader>
          <SheetTitle className="mt-8 flex items-center justify-between sm:mt-6">
            {t('order.orderDetail')}
          </SheetTitle>
          {getSelectedItems().length > 0 && (
            <div className="flex gap-2">
              {selectedOrder?.result?.type === IOrderType.TAKE_OUT ? (
                <CreateOrderTrackingByStaffDialog />
              ) : (
                <div className="flex gap-2">
                  <CreateOrderTrackingByStaffDialog />
                  <CreateOrderTrackingByRobotDialog />
                </div>
              )}
            </div>
          )}
        </SheetHeader>
        <div className="mt-4">
          {order ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 rounded-lg border-2 border-primary bg-primary/5 p-2 sm:p-4">
                <div className="font-medium text-primary">
                  {t('order.currentOrder')}
                </div>
                <CustomerInformation orderDetailData={selectedOrder?.result} />
                <OrderItemList orderDetailData={selectedOrder?.result} />
              </div>
              {orderDetails && orderDetails.length > 0 && (
                <div className="flex items-center gap-1">
                  <CircleAlert size={14} className="text-blue-500" />
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    {t('order.refreshOrdersInTheSameTable')}
                  </span>
                </div>
              )}
              <div className="flex justify-start">
                <Button
                  onClick={
                    shouldFetchOrders ? handleRefetchAll : handleFetchOrders
                  }
                >
                  {shouldFetchOrders
                    ? t('order.refresh')
                    : t('order.loadOrdersInTheSameTable')}
                </Button>
              </div>
              {shouldFetchOrders && (
                <div className="flex flex-col gap-4">
                  {orderDetails
                    .filter((orderDetail) => orderDetail.slug !== order)
                    .map((orderDetail) => (
                      <div
                        key={orderDetail.slug}
                        className="flex flex-col gap-2 rounded-lg border p-4"
                      >
                        <CustomerInformation orderDetailData={orderDetail} />
                        <OrderItemList orderDetailData={orderDetail} />
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
              {tCommon('common.noData')}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
