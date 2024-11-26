import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PenSquareIcon } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'

import { UpdateTableForm } from '@/components/app/form'
import { ITable } from '@/types'

interface UpdateTableDialogProps {
  table: ITable
}

export default function UpdateTableDialog({ table }: UpdateTableDialogProps) {
  const { t } = useTranslation(['table'])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-1 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <PenSquareIcon className="icon" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('table.update')}</DialogTitle>
          <DialogDescription>
            {t('table.updateTableDescription')}
          </DialogDescription>
        </DialogHeader>
        <UpdateTableForm table={table} onSubmit={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}
