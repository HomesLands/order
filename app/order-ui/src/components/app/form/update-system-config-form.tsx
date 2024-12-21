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
    updateSystemConfigSchema,
    TUpdateSystemConfigSchema,
} from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ISystemConfig } from '@/types'
import { useUpdateSystemConfig } from '@/hooks'
import { showToast } from '@/utils'

interface IFormUpdateSystemConfigProps {
    systemConfig?: ISystemConfig
    onSubmit: (isOpen: boolean) => void
}

export const UpdateSystemConfigForm: React.FC<
    IFormUpdateSystemConfigProps
> = ({ systemConfig, onSubmit }) => {
    const queryClient = useQueryClient()
    const { t } = useTranslation(['config'])
    const { mutate: updateSystemConfig } = useUpdateSystemConfig()
    const form = useForm<TUpdateSystemConfigSchema>({
        resolver: zodResolver(updateSystemConfigSchema),
        defaultValues: {
            slug: systemConfig?.slug || '',
            key: systemConfig?.key || '',
            value: systemConfig?.value || '',
            description: systemConfig?.description || '',
        },
    })

    const handleSubmit = (data: TUpdateSystemConfigSchema) => {
        updateSystemConfig(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['systemConfigs'],
                })
                onSubmit(false)
                form.reset()
                showToast(t('toast.updateSystemConfigSuccess'))
            },
        })
    }

    const formFields = {
        key: (
            <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('config.key')}</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        ),
        value: (
            <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('config.value')}</FormLabel>
                        <FormControl>
                            <Input {...field} />
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
                        <FormLabel>{t('config.description')}</FormLabel>
                        <FormControl>
                            <Input {...field} />
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
                            {t('config.update')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
