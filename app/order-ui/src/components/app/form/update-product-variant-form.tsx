import React from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
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
import { updateProductVariantSchema, TUpdateProductVariantSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { IUpdateProductVariantRequest, IProductVariant } from '@/types'
import { useUpdateProductVariant } from '@/hooks'
import { showToast } from '@/utils'

interface IFormUpdateProductVariantProps {
  productVariant: IProductVariant
  onSubmit: (isOpen: boolean) => void
}

export const UpdateProductVariantForm: React.FC<IFormUpdateProductVariantProps> = ({
  productVariant,
  onSubmit
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product'])
  const { mutate: createProductVariant } = useUpdateProductVariant()
  const form = useForm<TUpdateProductVariantSchema>({
    resolver: zodResolver(updateProductVariantSchema),
    defaultValues: {
      price: productVariant.price,
      product: productVariant.slug
    }
  })

  const handleSubmit = (data: IUpdateProductVariantRequest) => {
    createProductVariant(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['productVariants']
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.createProductVariantSuccess'))
      }
    })
  }

  const formFields = {
    price: (
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.price')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                placeholder={t('product.enterPrice')}
                value={field.value || ''}
                onChange={(e) => field.onChange(Number(e.target.value))} // Chuyển đổi giá trị thành số
              />
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
              {t('productVariant.update')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
