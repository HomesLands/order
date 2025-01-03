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
import { QuantitySelector } from '@/components/app/button'
import { CartNoteInput } from '@/components/app/input'
import { publicFileURL, ROUTE } from '@/constants'
import { formatCurrency } from '@/utils'

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
            <span className="absolute top-0 right-0 flex items-center justify-center p-2 text-xs font-semibold bg-white border border-gray-300 rounded-full h-7 w-7 text-primary">
              {cartItems?.orderItems.length}
            </span>
          )}
          <Button variant="default">
            <ShoppingCart className="text-white icon" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[90%]">
        <div className="pb-10 mx-4 overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{t('menu.order')}</DrawerTitle>
            <DrawerDescription>{t('menu.orderDescription')}</DrawerDescription>
          </DrawerHeader>
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
                            {`${formatCurrency(item.price || 0)}`}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveCartItem(item.id)}
                        >
                          <Trash2 size={20} className="text-muted-foreground" />
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
            {/* <PromotionInput /> */}
          </div>
          <DrawerFooter>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('menu.total')}</span>
                <span>{`${formatCurrency(subtotal || 0)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('menu.discount')}
                </span>
                <span className="text-xs text-green-600">
                  - {`${formatCurrency(discount)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 font-medium border-t">
                <span className="font-semibold">{t('menu.subTotal')}</span>
                <span className="text-lg font-bold text-primary">
                  {`${formatCurrency(total)}`}
                </span>
              </div>
            </div>
            <div className="grid flex-row grid-cols-2 gap-2">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full mt-4 border border-gray-400 rounded-full"
                >
                  {tCommon('common.close')}
                </Button>
              </DrawerClose>
              <NavLink to={ROUTE.STAFF_CHECKOUT_ORDER}>
                <Button
                  disabled={!cartItems}
                  className="w-full mt-4 text-white rounded-full bg-primary"
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
