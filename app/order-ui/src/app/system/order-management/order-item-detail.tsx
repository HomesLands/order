import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CheckedState } from '@radix-ui/react-checkbox'

import { IOrderDetail, OrderStatus } from '@/types'
import { Button, Checkbox } from '@/components/ui'
import { useOrderTrackingStore } from '@/stores'
import OrderItemStatusBadge from '@/components/app/badge/order-item-status-badge'

interface OrderItemDetailProps {
  order: IOrderDetail
}

export default function OrderItemDetail({ order }: OrderItemDetailProps) {
  const { t } = useTranslation(['menu'])
  const [showDetails, setShowDetails] = useState(false)
  const {
    addSelectedItem,
    removeSelectedItem,
    getSelectedItems,
  } = useOrderTrackingStore()
  const [selectedIndexes, setSelectedIndexes] = useState<{
    [key: string]: boolean
  }>({})

  // Sync selectedIndexes with store
  useEffect(() => {
    const selectedItems = getSelectedItems()
    const newSelectedIndexes: { [key: string]: boolean } = {}

    selectedItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const key = `${item.slug}-${i}`
        newSelectedIndexes[key] = false
      }
    })
    setSelectedIndexes(newSelectedIndexes)
  }, [getSelectedItems])

  const handleSelectOrderItem = (
    checked: CheckedState,
    orderItem: IOrderDetail,
    itemIndex: number,
  ) => {
    const key = `${orderItem.slug}-${itemIndex}`

    if (checked === true) {
      setSelectedIndexes((prev) => ({ ...prev, [key]: true }))
      const singleItem: IOrderDetail = {
        ...orderItem,
        quantity: 1,
        subtotal: orderItem.variant.price,
        slug: orderItem.slug,
        index: itemIndex, // Add index to track specific item
      }
      addSelectedItem(singleItem)
    } else {
      // Xóa trạng thái khi bỏ chọn
      setSelectedIndexes((prev) => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })

      // Xóa item khỏi store
      // removeSelectedItem(key)
      removeSelectedItem(`${orderItem.slug}-${itemIndex}`)
    }
  }

  const isChecked = (orderItem: IOrderDetail, index: number) => {
    const key = `${orderItem.slug}-${index}`
    // Kiểm tra trạng thái dựa trên `selectedIndexes`
    return !!selectedIndexes[key]
  }

  const renderOrderItem = (orderItem: IOrderDetail) => {
    const totalProcessedItems =
      orderItem.status.RUNNING + orderItem.status.COMPLETED

    const items = Array(orderItem.quantity)
      .fill(null)
      .map((_, index) => {
        if (index < orderItem.status.COMPLETED) {
          return { status: OrderStatus.COMPLETED, index }
        }
        if (index < orderItem.status.COMPLETED + orderItem.status.RUNNING) {
          return { status: OrderStatus.SHIPPING, index }
        }
        return { status: OrderStatus.PENDING, index }
      })

    return (
      <div key={orderItem.id} className="space-y-2">
        <div className="font-medium">
          {orderItem.variant.product.name}{' '}
          {orderItem.note && `(${orderItem.note})`}
          <span className="ml-2 text-sm text-gray-500">
            ({totalProcessedItems}/{orderItem.quantity})
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.index}
              className="grid flex-row items-center grid-cols-5 gap-3 px-2 py-4 border rounded-md"
            >
              {item.status === OrderStatus.PENDING ? (
                <div className="flex flex-row items-center col-span-3 gap-2">
                  <Checkbox
                    checked={isChecked(orderItem, item.index)}
                    onCheckedChange={(checked) =>
                      handleSelectOrderItem(checked, orderItem, item.index)
                    }
                  />
                  <p className="text-sm">{orderItem.variant.product.name}</p>
                  <p className="text-sm">
                    {t('order.size')}
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              ) : (
                <div className="flex flex-row items-center justify-start col-span-3 gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${item.status === OrderStatus.COMPLETED
                      ? 'bg-green-500'
                      : item.status === OrderStatus.SHIPPING
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                      }`}
                  />
                  <p className="text-sm">{orderItem.variant.product.name}</p>
                  {'-'}
                  <p className="text-sm">
                    {t('order.size')}
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              )}

              <div className="col-span-1 text-sm text-center">
                {orderItem.variant.price.toLocaleString()}đ
              </div>
              <div className="flex justify-end col-span-1">
                <OrderItemStatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg">
      <Button
        variant="outline"
        onClick={() => setShowDetails(!showDetails)}
        className="justify-between w-fit"
      >
        <span className="text-sm font-medium">{t('order.orderDetail')}</span>
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>

      {showDetails && (
        <div className="mt-4 space-y-4">{renderOrderItem(order)}</div>
      )}
    </div>
  )
}
