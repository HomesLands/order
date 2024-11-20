import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Form,
  Button
} from '@/components/ui'
import { updateProductSchema, TUpdateProductSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { IProduct, IUpdateProductRequest } from '@/types'
import { useUpdateProduct } from '@/hooks'
import { showToast } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { IsLimitSwitch } from '@/components/app/switch'
import { CatalogSelect } from '@/components/app/select'

interface IFormUpdateProductProps {
  product: IProduct
  onSubmit: (isOpen: boolean) => void
}

export const UpdateProductForm: React.FC<IFormUpdateProductProps> = ({ product, onSubmit }) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product'])
  const { mutate: updateProduct } = useUpdateProduct()
  const form = useForm<TUpdateProductSchema>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      slug: product.slug,
      name: product.name || '',
      description: product.description || '',
      isLimit: product.isLimit || false,
      isActive: product.isActive || true,
      catalog: product.catalog.slug || ''
    }
  })

  const handleSubmit = (data: IUpdateProductRequest) => {
    updateProduct(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['products']
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.updateProductSuccess'))
      }
    })
  }

  const formFields = {
    name: (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.productName')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('product.enterProductName')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    description: (
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.productDescription')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('product.enterProductDescription')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    isLimit: (
      <FormField
        control={form.control}
        name="isLimit"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4">
            <FormControl className="flex items-center p-0">
              <IsLimitSwitch defaultValue={product.isLimit} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    catalog: (
      <FormField
        control={form.control}
        name="catalog"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.productCatalog')}</FormLabel>
            <FormControl>
              <CatalogSelect defaultValue={product.catalog.slug} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <div className="mt-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(formFields).map((key) => (
              <React.Fragment key={key}>
                {formFields[key as keyof typeof formFields]}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-end">
            <Button className="flex justify-end" type="submit">
              {t('product.create')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
