'use client'

import { ShoppingCart, Trash2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useCartItemStore } from '@/stores'
import { ScrollArea } from '@/components/ui'
import { QuantitySelector } from '@/components/app/button'
import { CartNoteInput, PromotionInput } from '@/components/app/input'
import { publicFileURL, ROUTE } from '@/constants'

export default function CartDrawer() {
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
    <Drawer>
      <DrawerTrigger asChild className="z-30">
        <div>
          {cartItems?.orderItems && cartItems.orderItems.length > 0 && (
            <span className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary p-2 text-xs font-semibold text-white">
              {cartItems?.orderItems.length}
            </span>
          )}
          <Button variant="outline">
            <ShoppingCart className="icon" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t('menu.order')}</DrawerTitle>
            <DrawerDescription>{t('menu.orderDescription')}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[28rem]">
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 space-y-2 py-2">
                  {cartItems ? (
                    cartItems?.orderItems?.map((item) => (
                      <div
                        key={item.slug}
                        className="flex flex-col gap-4 border-b pb-4"
                      >
                        <div
                          key={`${item.slug}`}
                          className="flex flex-row items-center gap-2 rounded-xl"
                        >
                          {/* Hình ảnh sản phẩm */}
                          <img
                            src={`${publicFileURL}/${item.image}`}
                            alt={item.name}
                            className="h-20 w-20 rounded-2xl object-cover"
                          />
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="flex flex-row items-start justify-between">
                              <div className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate font-bold">
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

                            <div className="flex w-full items-center justify-between text-sm font-medium">
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
          <DrawerFooter>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('menu.total')}</span>
                <span>{`${subtotal?.toLocaleString('vi-VN') || 0}đ`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('menu.discount')}
                </span>
                <span className="text-xs text-green-600">
                  - {`${discount.toLocaleString('vi-VN')}đ`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <span className="font-semibold">{t('menu.subTotal')}</span>
                <span className="text-lg font-bold text-primary">
                  {`${total.toLocaleString('vi-VN')}đ`}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 flex-row gap-2">
              <DrawerClose asChild>
                <Button variant="outline" className="mt-4 w-full rounded-full">
                  {tCommon('common.close')}
                </Button>
              </DrawerClose>
              <NavLink to={ROUTE.STAFF_CHECKOUT_ORDER}>
                <Button
                  disabled={!cartItems}
                  className="mt-4 w-full rounded-full bg-primary text-white"
                >
                  {t('menu.continue')}
                </Button>
              </NavLink>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}