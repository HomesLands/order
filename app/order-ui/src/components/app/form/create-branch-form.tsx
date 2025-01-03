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
import { useCreateBranch } from '@/hooks'
import { createBranchSchema, TCreateBranchSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ICreateBranchRequest } from '@/types'
import { showToast } from '@/utils'

interface IFormCreateBranchProps {
    onSubmit: (isOpen: boolean) => void
}

export const CreateBranchForm: React.FC<IFormCreateBranchProps> = ({
    onSubmit,
}) => {
    const queryClient = useQueryClient()
    const { t } = useTranslation(['branch'])
    const { mutate: createBranch } = useCreateBranch()

    const form = useForm<TCreateBranchSchema>({
        resolver: zodResolver(createBranchSchema),
        defaultValues: {
            name: '',
            address: '',
        },
    })

    const handleSubmit = (data: ICreateBranchRequest) => {
        createBranch(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['branches'],
                })
                onSubmit(false)
                form.reset()
                showToast(t('toast.createBranchSuccess'))
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
                        <FormLabel>{t('branch.branchName')}</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder={t('branch.enterBranchName')} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        ),
        address: (
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('branch.branchAddress')}</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder={t('branch.enterBranchAddress')} />
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
                            {t('branch.create')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
