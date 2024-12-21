import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

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
import { updateSizeSchema, TUpdateSizeSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ISize, IUpdateSizeRequest } from '@/types'
import { useUpdateSize } from '@/hooks'
import { showToast } from '@/utils'

interface IFormUpdateSizeProps {
  size: ISize
  onSubmit: (isOpen: boolean) => void
}

export const UpdateSizeForm: React.FC<IFormUpdateSizeProps> = ({ size, onSubmit }) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product'])
  const { mutate: updateSize } = useUpdateSize()
  const form = useForm<TUpdateSizeSchema>({
    resolver: zodResolver(updateSizeSchema),
    defaultValues: {
      slug: size.slug || '',
      name: size.name || '',
      description: size.description || ''
    }
  })

  const handleSubmit = (data: IUpdateSizeRequest) => {
    updateSize(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['size']
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.updateSizeSuccess'))
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
            <FormLabel>{t('size.sizeName')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('size.enterSizeName')} />
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
            <FormLabel>{t('size.sizeDescription')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('size.enterSizeDescription')} />
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
              {t('size.update')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
