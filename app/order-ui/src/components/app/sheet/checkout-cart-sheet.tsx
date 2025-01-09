import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Label,
  ScrollArea,
  Input,
} from '@/components/ui'
import { useCartItemStore, useUserStore } from '@/stores'
import { CreateOrderDialog } from '@/components/app/dialog'
import { CartNoteInput, PromotionInput } from '@/components/app/input'
import { publicFileURL, Role } from '@/constants'
import { useDebouncedInput, usePagination, useUsers } from '@/hooks'
import { IUserInfo } from '@/types'
import { formatCurrency } from '@/utils'

export default function CheckoutCartSheet() {
  const { t: tCommon } = useTranslation(['common'])
  const { t } = useTranslation('menu')
  const { pagination } = usePagination()
  const { getUserInfo } = useUserStore()
  const { inputValue, setInputValue, debouncedInputValue } = useDebouncedInput()
  const [, setSelectedUser] = useState<IUserInfo | null>(null)
  const { getCartItems, removeCartItem, addCustomerInfo, addApprovalBy } =
    useCartItemStore()
  const [users, setUsers] = useState<IUserInfo[]>([])

  // Fetch users with debounced phone number
  const { data: userByPhoneNumber } = useUsers(
    debouncedInputValue
      ? {
          order: 'DESC',
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          phonenumber: debouncedInputValue,
          role: Role.CUSTOMER,
        }
      : null, // Không gọi hook nếu không có số điện thoại
  )

  // const users = userByPhoneNumber?.result?.items || []

  useEffect(() => {
    if (debouncedInputValue === '') {
      // Reset danh sách user khi giá trị số điện thoại bị xóa
      setUsers([])
    } else if (userByPhoneNumber?.result?.items) {
      // Cập nhật danh sách user khi fetch thành công
      setUsers(userByPhoneNumber.result.items)
    }
  }, [debouncedInputValue, userByPhoneNumber])

  useEffect(() => {
    addApprovalBy(getUserInfo()?.slug || '')
  }, [addApprovalBy, getUserInfo])

  const navigate = useNavigate()

  // Lấy dữ liệu từ store
  const cartItems = getCartItems()

  // Tính tổng tiền
  const subtotal = useMemo(() => {
    return cartItems?.orderItems.reduce((acc, orderItem) => {
      return acc + (orderItem.price || 0) * orderItem.quantity
    }, 0)
  }, [cartItems])

  const discount = 0
  const total = subtotal ? subtotal - discount : 0

  const handleRemoveCartItem = (orderItemId: string) => {
    removeCartItem(orderItemId)
  }

  const handleAddOwner = (user: IUserInfo) => () => {
    addCustomerInfo(user)
    setInputValue('')
    setUsers([])
    setSelectedUser(user)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button disabled={!cartItems?.table || cartItems?.table === ''}>
          {t('order.confirmation')}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader className="p-4">
          <SheetTitle className="text-primary">
            {t('order.orderInformation')}
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col bg-transparent backdrop-blur-md">
          {/* Cart Items */}
          <ScrollArea className="max-h-[28rem] flex-1 px-4">
            <div className="flex flex-1 flex-col gap-4 pb-8">
              <div className="flex flex-col gap-4 space-y-2 py-2">
                {/* Customer Information */}
                <div className="mt-6 flex flex-col gap-4 border-b pb-6 sm:relative">
                  <div className="flex flex-col gap-4">
                    <Label>{t('order.phoneNumber')}</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('order.enterPhoneNumber')}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <Button
                        onClick={handleAddOwner(getUserInfo() as IUserInfo)}
                      >
                        {t('order.defaultApprover')}
                      </Button>
                    </div>
                    {cartItems && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {cartItems.ownerFullName}
                        </span>
                        <span className="text-sm">
                          {cartItems.ownerPhoneNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dropdown danh sách user */}
                  {users.length > 0 && (
                    <div className="absolute z-10 mt-16 w-full rounded-md border bg-white p-2 shadow-lg">
                      {users.map((user, index) => (
                        <div
                          key={user.slug}
                          onClick={handleAddOwner(user)}
                          className={`cursor-pointer p-2 hover:bg-gray-100 ${
                            index < users.length - 1 ? 'border-b' : ''
                          }`}
                        >
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phonenumber}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Table Information */}
                <div className="mt-5 flex flex-col gap-4 border-b pb-6">
                  <div className="flex flex-col gap-2">
                    <Label>{t('order.deliveryMethod')}</Label>
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex w-fit items-center justify-center rounded-full bg-primary/15 px-4 py-1 text-xs font-thin text-primary">
                        {t('order.dineIn')}
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          {t('order.tableNumber')}: {cartItems?.tableName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                {cartItems?.orderItems.map((item) => (
                  <div
                    key={item.slug}
                    className="flex flex-col gap-4 border-b pb-4"
                  >
                    <div
                      key={`${item.slug}`}
                      className="flex w-full items-center gap-2 rounded-xl"
                    >
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
                              {`${formatCurrency(item.price || 0)}`}
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
                          <span>
                            {t('order.quantity')} {item.quantity}
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {`${formatCurrency((item.price || 0) * item.quantity)}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CartNoteInput cartItem={item} />
                  </div>
                ))}
              </div>
              <PromotionInput />
            </div>
          </ScrollArea>

          {/* Order Summary and Checkout */}
          <div className="border-t p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('order.total')}
                </span>
                <span>{`${formatCurrency(subtotal || 0)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('order.discount')}
                </span>
                <span className="text-xs text-green-600">
                  - {`${formatCurrency(discount)}`}
                </span>
              </div>
              <div className="flex flex-col justify-start">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">
                    {t('order.grandTotal')}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {`${formatCurrency(total)}`}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground/60">
                  {t('order.vat')}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center justify-between gap-2 py-4">
              <div className="col-span-1">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => navigate(-1)}
                >
                  {tCommon('common.back')}
                </Button>
              </div>
              <CreateOrderDialog
                disabled={Boolean(
                  !cartItems?.orderItems?.length || !cartItems?.approvalBy,
                )}
              />{' '}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
