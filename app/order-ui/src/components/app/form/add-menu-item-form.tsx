import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Form,
  Button,
} from '@/components/ui'
import { addMenuItemSchema, TAddMenuItemSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { IAddMenuItemRequest, IProduct } from '@/types'
import { useAddMenuItem } from '@/hooks'
import { showToast } from '@/utils'

interface IFormAddMenuItemProps {
  product: IProduct
  onSubmit: (isOpen: boolean) => void
}

export const AddMenuItemForm: React.FC<IFormAddMenuItemProps> = ({
  product,
  onSubmit,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['menu'])
  const { slug } = useParams()
  const { mutate: addMenuItem } = useAddMenuItem()
  const form = useForm<TAddMenuItemSchema>({
    resolver: zodResolver(addMenuItemSchema),
    defaultValues: {
      menuSlug: slug,
      productSlug: product.slug,
      productName: product.name,
      defaultStock: 0,
    },
  })

  const handleSubmit = (data: IAddMenuItemRequest) => {
    addMenuItem(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['specific-menu'],
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.addMenuItemSuccess'))
      },
    })
  }

  const formFields = {
    menuSlug: (
      <FormField
        control={form.control}
        name="menuSlug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.menuSlug')}</FormLabel>
            <FormControl>
              <Input
                readOnly
                {...field}
                placeholder={t('menu.enterMenuSlug')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    productName: (
      <FormField
        control={form.control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.productName')}</FormLabel>
            <FormControl>
              <Input
                readOnly
                {...field}
                placeholder={t('menu.enterProductName')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    defaultStock: (
      <FormField
        control={form.control}
        name="defaultStock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.defaultStock')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t('menu.defaultStockDescription')}
                onChange={(e) => {
                  const valueAsNumber =
                    e.target.value === '' ? '' : Number(e.target.value)
                  field.onChange(valueAsNumber)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
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
              {t('menu.addMenuItem')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
