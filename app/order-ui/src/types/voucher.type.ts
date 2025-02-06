import { IBase } from './base.type'

export interface IVoucher extends IBase {
  title: string
  description?: string
  code: string
  maxUsage: number
  minOrderValue: number
  startDate: string
  endDate: string
}

export interface ICreateVoucherRequest {
  title: string
  description?: string
  code: string
  maxUsage: number
  minOrderValue: number
  startDate: string
  endDate: string
}

export interface IUpdateVoucherRequest {
  slug: string
  title: string
  description?: string
  code: string
  maxUsage: number
  minOrderValue: number
  startDate: string
  endDate: string
}
