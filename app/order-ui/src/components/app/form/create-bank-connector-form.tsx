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
  Form,
  Button,
  Input,
} from '@/components/ui'
import {
  createBankConnectorSchema,
  TCreateBankConnectorSchema,
} from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ICreateBankConnectorRequest } from '@/types'
import { useCreateBankConnector } from '@/hooks'
import { showToast } from '@/utils'

interface IFormCreateBankConnectorProps {
  onSubmit: (isOpen: boolean) => void
}

export const CreateBankConnectorForm: React.FC<
  IFormCreateBankConnectorProps
> = ({ onSubmit }) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['bank'])
  const { mutate: createBankConnector } = useCreateBankConnector()
  const form = useForm<TCreateBankConnectorSchema>({
    resolver: zodResolver(createBankConnectorSchema),
    defaultValues: {
      xProviderId: '',
      xService: '',
      xOwnerNumber: '',
      xOwnerType: '',
      beneficiaryName: '',
      virtualAccountPrefix: '',
    },
  })

  const handleSubmit = (data: ICreateBankConnectorRequest) => {
    createBankConnector(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['bank'],
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.createBankConnectorSuccess'))
      },
    })
  }

  const formFields = {
    xProviderId: (
      <FormField
        control={form.control}
        name="xProviderId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('bank.xProviderId')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    xService: (
      <FormField
        control={form.control}
        name="xService"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('bank.xService')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    xOwnerNumber: (
      <FormField
        control={form.control}
        name="xOwnerNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('bank.xOwnerNumber')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    xOwnerType: (
      <FormField
        control={form.control}
        name="xOwnerType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('bank.xOwnerType')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    beneficiaryName: (
      <FormField
        control={form.control}
        name="beneficiaryName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('bank.beneficiaryName')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    virtualAccountPrefix: (
      <FormField
        control={form.control}
        name="virtualAccountPrefix"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('bank.virtualAccountPrefix')}</FormLabel>
            <FormControl>
              <Input {...field} />
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
              {t('bank.create')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
