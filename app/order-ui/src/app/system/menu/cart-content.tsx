import { NavLink } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, ScrollArea } from '@/components/ui'
import { QuantitySelector } from '@/components/app/button'
import { CartNoteInput, PromotionInput } from '@/components/app/input'
import { useCartItemStore } from '@/stores'
import { publicFileURL, ROUTE } from '@/constants'

export default function CartContent() {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  const { getCartItems, removeCartItem } = useCartItemStore()

  const cartItems = getCartItems()

  // Tính tổng tiền
  const subtotal = cartItems?.orderItems?.reduce((acc, orderItem) => {
    return acc + (orderItem.price || 0) * orderItem.quantity
  }, 0)

  const discount = 0 // Giả sử giảm giá là 0
  const total = subtotal ? subtotal - discount : 0

  const handleRemoveCartItem = (id: string) => {
    removeCartItem(id)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - Fixed */}
      <div className="z-30 px-4 pt-2 pb-2 border-b bg-background">
        <h1 className="text-lg font-medium">{t('menu.order')}</h1>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4 py-2 space-y-2">
              {cartItems ? (
                cartItems?.orderItems?.map((item) => (
                  <div
                    key={item.slug}
                    className="flex flex-col gap-4 pb-4 border-b"
                  >
                    <div
                      key={`${item.slug}`}
                      className="flex flex-row items-center gap-2 rounded-xl"
                    >
                      {/* Hình ảnh sản phẩm */}
                      <img
                        src={`${publicFileURL}/${item.image}`}
                        alt={item.name}
                        className="object-cover w-20 h-20 rounded-2xl"
                      />
                      <div className="flex flex-col flex-1 gap-2">
                        <div className="flex flex-row items-start justify-between">
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-bold truncate">
                              {item.name}
                            </span>
                            <span className="text-xs font-thin text-muted-foreground">
                              {`${(item.price || 0).toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveCartItem(item.id)}
                          >
                            <Trash2
                              size={20}
                              className="text-muted-foreground"
                            />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between w-full text-sm font-medium">
                          <QuantitySelector cartItem={item} />
                        </div>
                      </div>
                    </div>
                    <CartNoteInput cartItem={item} />
                  </div>
                ))
              ) : (
                <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
                  {tCommon('common.noData')}
                </p>
              )}
            </div>
            <PromotionInput />
          </div>
        </ScrollArea>
      </div>

      {/* Order Summary - Fixed */}
      <div className="p-4 border-t bg-background">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('menu.total')}</span>
            <span>{`${subtotal?.toLocaleString('vi-VN') || 0}đ`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('menu.discount')}</span>
            <span className="text-xs text-green-600">
              - {`${discount.toLocaleString('vi-VN')}đ`}
            </span>
          </div>
          <div className="flex justify-between pt-2 font-medium border-t">
            <span className="font-semibold">{t('menu.subTotal')}</span>
            <span className="text-lg font-bold text-primary">
              {`${total.toLocaleString('vi-VN')}đ`}
            </span>
          </div>
        </div>
        <NavLink to={ROUTE.STAFF_CHECKOUT_ORDER}>
          <Button
            disabled={!cartItems}
            className="w-full mt-4 text-white rounded-full bg-primary"
          >
            {t('menu.continue')}
          </Button>
        </NavLink>
      </div>
    </div>
  )
}
