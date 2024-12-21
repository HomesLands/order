import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
  Button,
} from '@/components/ui'
import { createCatalogSchema, TCreateCatalogSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ICreateCatalogRequest } from '@/types'
import { useCreateCatalog } from '@/hooks'
import { showToast } from '@/utils'

interface IFormCreateCatalogProps {
  onSubmit: (isOpen: boolean) => void
}

export const CreateCatalogForm: React.FC<IFormCreateCatalogProps> = ({
  onSubmit,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product'])
  const { mutate: createCatalog } = useCreateCatalog()
  const form = useForm<TCreateCatalogSchema>({
    resolver: zodResolver(createCatalogSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const handleSubmit = (data: ICreateCatalogRequest) => {
    createCatalog(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['catalog'],
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.createCatalogSuccess'))
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
              <Input
                {...field}
                placeholder={t('catalog.enterCatalogDescription')}
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
              {t('catalog.create')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
