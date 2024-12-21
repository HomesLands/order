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
import { updateCatalogSchema, TUpdateCatalogSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ICatalog, IUpdateCatalogRequest } from '@/types'
import { useUpdateCatalog } from '@/hooks'
import { showToast } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'

interface IFormUpdateCatalogProps {
  catalog: ICatalog
  onSubmit: (isOpen: boolean) => void
}

export const UpdateCatalogForm: React.FC<IFormUpdateCatalogProps> = ({ catalog, onSubmit }) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product'])
  const { mutate: updateCatalog } = useUpdateCatalog()
  const form = useForm<TUpdateCatalogSchema>({
    resolver: zodResolver(updateCatalogSchema),
    defaultValues: {
      slug: catalog.slug,
      name: catalog.name || '',
      description: catalog.description || ''
    }
  })

  const handleSubmit = (data: IUpdateCatalogRequest) => {
    updateCatalog(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['catalog']
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.updateCatalogSuccess'))
      },
    })
  }

  const formFields = {
    name: (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('catalog.catalogName')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('catalog.enterCatalogName')} />
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
            <FormLabel>{t('catalog.catalogDescription')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('catalog.enterCatalogDescription')} />
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
              {t('catalog.update')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
