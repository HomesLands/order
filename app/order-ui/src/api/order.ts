import { AxiosRequestConfig } from 'axios'
import moment from 'moment'

import { http } from '@/utils'
import {
  IApiResponse,
  IOrder,
  ICreateOrderRequest,
  IInitiatePaymentRequest,
  ICreateOrderResponse,
  IPayment,
  ICreateOrderTrackingRequest,
  IOrderTracking,
  IOrderInvoice,
  IGetOrderInvoiceRequest,
  IPaginationResponse,
  IOrdersQuery,
} from '@/types'
import { useDownloadStore } from '@/stores'

export async function getAllOrders(
  params: IOrdersQuery,
): Promise<IApiResponse<IPaginationResponse<IOrder>>> {
  console.log({ params })
  const response = await http.get<IApiResponse<IPaginationResponse<IOrder>>>(
    '/orders',
    {
      // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
      doNotShowLoading: true,
      params,
    },
  )
  // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
  return response.data
}

export async function getOrderBySlug(
  slug: string,
): Promise<IApiResponse<IOrder>> {
  const response = await http.get<IApiResponse<IOrder>>(`/orders/${slug}`, {
    // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
    doNotShowLoading: true,
  })
  // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
  return response.data
}

export async function createOrder(
  params: ICreateOrderRequest,
): Promise<IApiResponse<ICreateOrderResponse>> {
  const response = await http.post<IApiResponse<ICreateOrderResponse>>(
    '/orders',
    params,
  )
  return response.data
}

export async function initiatePayment(
  params: IInitiatePaymentRequest,
): Promise<IApiResponse<IPayment>> {
  const response = await http.post<IApiResponse<IPayment>>(
    `/payment/initiate`,
    params,
  )
  return response.data
}

export async function exportPaymentQRCode(slug: string): Promise<Blob> {
  const { setProgress, setFileName, setIsDownloading, reset } =
    useDownloadStore.getState()
  const currentDate = new Date().toISOString()
  setFileName(`TRENDCoffee-${currentDate}.pdf`)
  setIsDownloading(true)
  try {
    const response = await http.post(`payment/${slug}/export`, null, {
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
        )
        setProgress(percentCompleted)
      },
      doNotShowLoading: true,
    } as AxiosRequestConfig)
    // const blob = new Blob([response.data], { type: 'application/pdf' })
    // saveAs(blob, `TREND Coffee QR Code-${currentDate}.pdf`)
    return response.data
  } finally {
    setIsDownloading(false)
    reset()
  }
}

export async function createOrderTracking(
  params: ICreateOrderTrackingRequest,
): Promise<IApiResponse<IOrderTracking>> {
  const response = await http.post<IApiResponse<IOrderTracking>>(
    `/trackings`,
    params,
  )
  return response.data
}

export async function getOrderInvoice(
  params: IGetOrderInvoiceRequest,
): Promise<IApiResponse<IPaginationResponse<IOrderInvoice>>> {
  const response = await http.get<
    IApiResponse<IPaginationResponse<IOrderInvoice>>
  >('/invoice/specific', {
    params,
  })
  return response.data
}

export async function exportOrderInvoice(order: string): Promise<Blob> {
  const { setProgress, setFileName, setIsDownloading, reset } =
    useDownloadStore.getState()
  const currentDate = moment(new Date()).toISOString()
  setFileName(`Invoice-${currentDate}.pdf`)
  setIsDownloading(true)
  try {
    const response = await http.post(
      `/invoice/export`, // Đổi từ GET sang POST
      { order }, // Truyền slug trong payload
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          )
          setProgress(percentCompleted)
        },
        doNotShowLoading: true,
      } as AxiosRequestConfig,
    )
    return response.data
  } finally {
    setIsDownloading(false)
    reset()
  }
}
