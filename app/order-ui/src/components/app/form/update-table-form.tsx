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
import { IUpdateTableRequest, ITable, IApiResponse } from '@/types'
import { useUpdateTable } from '@/hooks'
import { showErrorToast, showToast } from '@/utils'
import TableLocationSelect from '../select/table-location-select'
import { isAxiosError } from 'axios'
import { AxiosError } from 'axios'

interface IFormUpdateTableProps {
  table: ITable | null
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
      slug: table?.slug,
      name: table?.name,
      location: table?.location,
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
      onError: (error) => {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError<IApiResponse<void>>
          if (axiosError.response?.data.code)
            showErrorToast(axiosError.response.data.code)
        }
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
              <TableLocationSelect defaultValue={field.value} {...field} />
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
              {t('table.update')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
