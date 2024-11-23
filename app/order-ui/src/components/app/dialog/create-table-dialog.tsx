import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircledIcon } from '@radix-ui/react-icons'

import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'

import { CreateTableForm } from '@/components/app/form'

export default function CreateTableDialog() {
  const { t } = useTranslation(['table'])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-1 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <PlusCircledIcon className="icon" />
          {t('table.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('table.create')}</DialogTitle>
          <DialogDescription>
            {t('table.createTableDescription')}
          </DialogDescription>
        </DialogHeader>
        <CreateTableForm onSubmit={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}