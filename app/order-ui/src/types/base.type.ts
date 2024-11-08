export interface IApiResponse<T> {
  code: number
  error: boolean
  message: string
  method: string
  path: string
  result: T
}

export interface IPaginationResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalPages: number
}

export interface IQuery {
  page: number | 1
  pageSize: number | 10
  order: 'ASC' | 'DESC'
}

export interface IBase {
  createdAt?: string
  updatedAt?: string
  slug?: string
}

export interface IApiErrorResponse {
  code: number
  error: boolean
  message: string
  method: string
  path: string
}
