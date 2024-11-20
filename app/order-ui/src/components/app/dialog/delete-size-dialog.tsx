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
  DialogTrigger
} from '@/components/ui'

import { IApiResponse, ISize } from '@/types'

import { useDeleteSize } from '@/hooks'
import { showErrorToast, showToast } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'

export default function DeleteSizeDialog({ size }: { size: ISize }) {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product'])
  const { t: tCommon } = useTranslation('common')
  const { t: tToast } = useTranslation('toast')
  const { mutate: deleteSize } = useDeleteSize()
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (catalogSlug: string) => {
    deleteSize(catalogSlug, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['size']
        })
        setIsOpen(false)
        showToast(tToast('toast.deleteSizeSuccess'))
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError<IApiResponse<void>>
          if (axiosError.response?.data.code) showErrorToast(axiosError.response.data.code)
        }
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex justify-start w-full" asChild>
        <DialogTrigger asChild>
          <Button variant="ghost" className="gap-1 px-2 text-sm" onClick={() => setIsOpen(true)}>
            <Trash2 className="icon" />
            {t('size.delete')}
          </Button>
        </DialogTrigger>
      </DialogTrigger>

      <DialogContent className="max-w-[22rem] rounded-md sm:max-w-[32rem] font-beVietNam">
        <DialogHeader>
          <DialogTitle className="pb-4 border-b border-destructive text-destructive">
            <div className="flex items-center gap-2">
              <TriangleAlert className="w-6 h-6" />
              {t('size.delete')}
            </div>
          </DialogTitle>
          <DialogDescription className="p-2 bg-red-100 rounded-md text-destructive">
            {tCommon('common.deleteNote')}
          </DialogDescription>

          <div className="py-4 text-sm text-gray-500">
            {t('size.deleteSizeWarning1')} <span className="font-bold">{size?.name}</span> <br />
            <br />
            {t('size.deleteSizeConfirmation')}
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {tCommon('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={() => size && handleSubmit(size.slug || '')}>
            {tCommon('common.confirmDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
