import { z } from 'zod'
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
  PasswordInput
} from '@/components/ui'
import { loginSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLoading } from '@/components/app/loading'
import React from 'react'
// import { useThemeStore } from '@/stores'

interface IFormLoginProps {
  onSubmit: (data: z.infer<typeof loginSchema>) => void
  isLoading: boolean
}

export const LoginForm: React.FC<IFormLoginProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation(['auth'])
  //   const { getTheme } = useThemeStore()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phonenumber: '',
      password: ''
    }
  })

  const handleSubmit = (values: z.infer<typeof loginSchema>) => {
    onSubmit(values)
  }

  const formFields = {
    phonenumber: (
      <FormField
        control={form.control}
        name="phonenumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('login.phoneNumber')}</FormLabel>
            <FormControl>
              <Input placeholder={t('login.enterPhoneNumber')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    password: (
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('login.password')}</FormLabel>
            <FormControl>
              <PasswordInput placeholder={t('login.enterPassword')} {...field} />
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
          <div className="grid grid-cols-1 md:w-[24rem]  text-white gap-2">
            {Object.keys(formFields).map((key) => (
              <React.Fragment key={key}>
                {formFields[key as keyof typeof formFields]}
              </React.Fragment>
            ))}{' '}
          </div>
          <div className="flex items-center justify-between w-full">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <ButtonLoading /> : t('login.title')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
