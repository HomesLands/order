import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import { Button, ScrollArea } from '@/components/ui'
import { useExportPayment, useInitiatePayment, useOrderBySlug } from '@/hooks'
import { PaymentMethod, ROUTE } from '@/constants'
import { PaymentMethodSelect } from '@/app/system/payment'
import { loadDataToPrinter, showToast } from '@/utils'
import { ButtonLoading } from '@/components/app/loading'
// import { QrCodeDialog } from '@/components/app/dialog'

export default function PaymentPage() {
  const { t } = useTranslation(['menu'])
  const { slug } = useParams()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const { data: order, refetch: refetchOrder } = useOrderBySlug(slug as string)
  const { mutate: initiatePayment, isPending: isPendingInitiatePayment } =
    useInitiatePayment()
  const { mutate: exportPayment, isPending: isPendingExportPayment } =
    useExportPayment()
  const [qrCode, setQrCode] = useState<string>('')
  const [paymentSlug, setPaymentSlug] = useState<string>('')
  const [isPolling, setIsPolling] = useState<boolean>(false)

  // Tạo biến để kiểm tra trạng thái nút xác nhận
  const isDisabled = !paymentMethod || !slug

  // Xử lý xác nhận thanh toán
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPolling) {
      interval = setInterval(async () => {
        const updatedOrder = await refetchOrder()
        const orderStatus = updatedOrder.data?.result?.status
        if (orderStatus === 'paid') {
          clearInterval(interval!)
          navigate(`${ROUTE.ORDER_SUCCESS}/${slug}`)
        }
      }, 3000) // Gọi API mỗi 3 giây
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPolling, refetchOrder, navigate, slug])

  // Xử lý chọn phương thức thanh toán
  const handleSelectPaymentMethod = (selectedPaymentMethod: string) => {
    setPaymentMethod(selectedPaymentMethod)
  }

  // Xử lý xác nhận thanh toán
  const handleConfirmPayment = () => {
    if (!slug || !paymentMethod) return

    if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
      initiatePayment(
        { orderSlug: slug, paymentMethod },
        {
          onSuccess: (data) => {
            setPaymentSlug(data.result.slug)
            setQrCode(data.result.qrCode)
            setIsPolling(true) // Bắt đầu polling khi thanh toán qua chuyển khoản ngân hàng
          },
          // onError: (error) => {
          //   if (isAxiosError(error)) {
          //     const axiosError = error as AxiosError<IApiResponse<void>>
          //     if (axiosError.response?.data.code)
          //       showErrorToast(axiosError.response.data.code)
          //   }
          // },
        },
      )
    } else if (paymentMethod === PaymentMethod.CASH) {
      initiatePayment(
        { orderSlug: slug, paymentMethod },
        {
          onSuccess: () => {
            navigate(`${ROUTE.ORDER_SUCCESS}/${slug}`)
          },
          // onError: (error) => {
          //   if (isAxiosError(error)) {
          //     const axiosError = error as AxiosError<IApiResponse<void>>
          //     if (axiosError.response?.data.code)
          //       showErrorToast(axiosError.response.data.code)
          //   }
          // },
        },
      )
    }
  }

  const handleExportPayment = () => {
    if (!slug) return
    exportPayment(paymentSlug, {
      onSuccess: (data: Blob) => {
        showToast(t('paymentMethod.exportPaymentSuccess'))
        // Load data to print
        loadDataToPrinter(data)
      },
      // onError: (error) => {
      //   if (isAxiosError(error)) {
      //     const axiosError = error as AxiosError<IApiResponse<void>>
      //     if (axiosError.response?.data.code)
      //       showErrorToast(axiosError.response.data.code)
      //   }
      // },
    })
  }

  return (
    <div className="flex flex-row h-full gap-2">
      <ScrollArea className="flex-1">
        <div className={`transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-background">
            <div className="flex flex-col w-full gap-3">
              {order && (
                <div className="w-full space-y-2">
                  {/* Thông tin khách hàng */}
                  <div className="grid items-center justify-between grid-cols-1 p-4 border rounded-sm sm:grid-cols-2">
                    <div className="flex flex-col col-span-1 gap-1 border-r sm:px-4">
                      <div className="grid grid-cols-2 gap-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.customerName')}
                        </h3>
                        <p className="text-sm font-semibold">{`${order.result.owner.lastName} ${order.result.owner.firstName}`}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.orderDate')}
                        </h3>
                        <span className="text-sm font-semibold">
                          {moment(order.result.createdAt).format(
                            'HH:mm DD/MM/YYYY',
                          )}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.phoneNumber')}
                        </h3>
                        <p className="text-sm font-semibold">
                          {order.result.owner.phonenumber}
                        </p>
                      </div>
                    </div>
                    {/* Thông tin vận chuyển */}
                    <div className="flex flex-col col-span-1 gap-1 border-r sm:px-4">
                      <div className="grid grid-cols-2 gap-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.deliveryMethod')}
                        </h3>
                        <p className="col-span-1 text-sm font-semibold">
                          {order.result.type === 'at-table'
                            ? t('order.dineIn')
                            : t('order.takeAway')}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.location')}
                        </h3>
                        <p className="col-span-1 text-sm font-semibold">
                          {order.result.table ? order.result.table.name : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Thông tin đơn hàng */}
                  <div>
                    <div className="grid w-full grid-cols-4 px-4 py-3 text-sm font-thin rounded-md bg-muted/60">
                      <span className="col-span-1">{t('order.product')}</span>
                      <span className="col-span-1">{t('order.unitPrice')}</span>
                      <span className="col-span-1 text-center">
                        {t('order.quantity')}
                      </span>
                      <span className="col-span-1 text-center">
                        {t('order.grandTotal')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col w-full border rounded-md">
                    {order?.result.orderItems.map((item) => (
                      <div
                        key={item.slug}
                        className="grid items-center w-full gap-4 p-4 pb-4 border-b rounded-t-md"
                      >
                        <div className="grid flex-row items-center w-full grid-cols-4">
                          <div className="flex w-full col-span-1 gap-2">
                            <div className="flex flex-col items-center justify-start gap-2 sm:flex-row sm:justify-center">
                              {/* <img
                                src={`${publicFileURL}/${item.variant.product.image}`}
                                alt={item.variant.product.name}
                                className="object-cover w-20 h-12 rounded-lg sm:h-16 sm:w-24"
                              /> */}
                              <div className="flex flex-col">
                                <span className="font-bold truncate">
                                  {item.variant.product.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center col-span-1">
                            <span className="text-sm">
                              {`${(item.variant.price || 0).toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                          <div className="flex justify-center col-span-1">
                            <span className="text-sm">
                              {item.quantity || 0}
                            </span>
                          </div>
                          <div className="col-span-1 text-center">
                            <span className="text-sm font-semibold text-primary">
                              {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col items-end w-full gap-2 p-4 pr-10">
                      <div className="flex w-[20rem] flex-col gap-2">
                        <div className="flex justify-between w-full pb-4 border-b">
                          <h3 className="text-sm font-medium">
                            {t('order.total')}
                          </h3>
                          <p className="text-sm font-semibold">
                            {`${order.result.subtotal.toLocaleString('vi-VN')}đ`}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex justify-between w-full">
                            <h3 className="font-semibold text-md">
                              {t('order.totalPayment')}
                            </h3>
                            <p className="text-lg font-semibold text-primary">
                              {`${order.result.subtotal.toLocaleString('vi-VN')}đ`}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {t('order.vat')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Lựa chọn phương thức thanh toán */}
                  <PaymentMethodSelect
                    qrCode={qrCode ? qrCode : ''}
                    total={order.result ? order.result.subtotal : ''}
                    onSubmit={handleSelectPaymentMethod}
                  />
                </div>
              )}
              <div className="flex justify-end py-6">
                {(paymentMethod === PaymentMethod.BANK_TRANSFER ||
                  paymentMethod === PaymentMethod.CASH) && (
                    <div className="flex gap-2">
                      <Button
                        disabled={isDisabled || isPendingInitiatePayment}
                        className="w-fit"
                        onClick={handleConfirmPayment}
                      >
                        {isPendingInitiatePayment && <ButtonLoading />}
                        {t('paymentMethod.confirmPayment')}
                      </Button>
                      {paymentSlug && (
                        <Button
                          disabled={isDisabled || isPendingExportPayment}
                          className="w-fit"
                          onClick={handleExportPayment}
                        >
                          {isPendingExportPayment && <ButtonLoading />}
                          {t('paymentMethod.exportPayment')}
                        </Button>
                      )}
                    </div>
                  )}
              </div>
              {/* {qrCode && <QrCodeDialog qrCode={qrCode} />} */}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
