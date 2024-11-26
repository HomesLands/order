import { useState } from 'react'
import { AxiosError, isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { Trash2, TriangleAlert } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

import { IApiResponse, ITable } from '@/types'

import { useDeleteTable } from '@/hooks'
import { showErrorToast, showToast } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'

export default function DeleteTablelog({ table }: { table: ITable }) {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['table'])
  const { t: tCommon } = useTranslation('common')
  const { t: tToast } = useTranslation('toast')
  const { mutate: deleteTable } = useDeleteTable()
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (tableSlug: string) => {
    deleteTable(tableSlug, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['tables'],
        })
        setIsOpen(false)
        showToast(tToast('toast.deleteTableSuccess'))
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex w-full justify-start" asChild>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="gap-1 text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Trash2 className="icon" />
          </Button>
        </DialogTrigger>
      </DialogTrigger>

      <DialogContent className="max-w-[22rem] rounded-md font-beVietNam sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle className="border-b border-destructive pb-4 text-destructive">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-6 w-6" />
              {t('table.delete')}
            </div>
          </DialogTitle>
          <DialogDescription className="rounded-md bg-red-100 p-2 text-destructive">
            {tCommon('common.deleteNote')}
          </DialogDescription>

          <div className="py-4 text-sm text-muted-foreground">
            {t('table.deleteTableWarning1')}{' '}
            <span className="font-bold">{table?.name}</span> <br />
            {t('table.deleteTableConfirmation')}
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {tCommon('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => table && handleSubmit(table.slug || '')}
          >
            {tCommon('common.confirmDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
