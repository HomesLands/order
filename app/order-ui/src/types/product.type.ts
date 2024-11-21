import { ICatalog } from './catalog.type'

export interface IProduct {
  name: string
  description: string
  isActive: boolean
  isLimit: boolean
  image: string
  rating: number
  catalog: ICatalog
  variants: IProductVariant[]
  slug: string
  createdAt: string
}

export interface IProductVariant {
  price: number
  product: IProduct
  size: {
    name: string
    description: string
    slug: string
  }
  slug: string
}

export interface ICreateProductRequest {
  name: string
  description?: string
  isLimit: boolean
  catalog: string
}

export interface IUpdateProductRequest {
  slug: string //Slug of the product
  name: string
  description?: string
  isLimit: boolean
  isActive?: boolean
  catalog: string
}

export interface ICreateProductVariantRequest {
  price: number
  size: string //Slug of size of the product
  product: string //Slug of the product
}

export interface IUpdateProductVariantRequest {
  price: number
  product: string //Slug of the product
}
