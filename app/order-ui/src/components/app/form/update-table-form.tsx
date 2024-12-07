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
import { updateTableSchema, TUpdateTableSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { IUpdateTableRequest, ITable } from '@/types'
import { useUpdateTable } from '@/hooks'
import { showToast } from '@/utils'

interface IFormUpdateTableProps {
  table: ITable
  onSubmit: (isOpen: boolean) => void
}

export const UpdateTableForm: React.FC<IFormUpdateTableProps> = ({
  table,
  onSubmit,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['table'])
  const { mutate: updateTable } = useUpdateTable()
  const form = useForm<TUpdateTableSchema>({
    resolver: zodResolver(updateTableSchema),
    defaultValues: {
      slug: table.slug,
      name: table.name,
      location: table.location,
      xPosition: table.xPosition || 0,
      yPosition: table.yPosition || 0,
    },
  })

  const handleSubmit = (data: IUpdateTableRequest) => {
    updateTable(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['tables'],
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.updateTableSuccess'))
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
            <FormLabel>{t('table.tableName')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterTableName')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    location: (
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.location')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterLocation')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    xPosition: (
      <FormField
        control={form.control}
        name="xPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.xPosition')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterXPosition')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    yPosition: (
      <FormField
        control={form.control}
        name="yPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.yPosition')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterYPosition')} />
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
              {t('table.update')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
