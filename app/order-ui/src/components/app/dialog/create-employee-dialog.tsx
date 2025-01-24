import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircledIcon } from '@radix-ui/react-icons'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

import { CreateEmployeeForm } from '@/components/app/form'

export default function CreateEmployeeDialog() {
  const { t } = useTranslation(['employee'])
  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 text-xs" onClick={() => setIsOpen(true)}>
          <PlusCircledIcon className="icon" />
          {t('employee.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-4/5 max-w-[90%] overflow-y-auto rounded-md px-6 sm:max-w-[36%]">
        <DialogHeader>
          <DialogTitle>{t('employee.create')}</DialogTitle>
          <DialogDescription>
            {t('employee.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <CreateEmployeeForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
