import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PaymentMethodRadioGroup } from '@/components/app/radio'
import { Label } from '@/components/ui'

interface PaymentMethodSelectProps {
  qrCode?: string
  total?: number | string
  onSubmit?: (paymentMethod: string) => void
}

export default function PaymentMethodSelect({
  qrCode,
  total,
  onSubmit,
}: PaymentMethodSelectProps) {
  const { t } = useTranslation('menu')

  const handlePaymentMethodSubmit = (paymentMethod: string) => {
    if (onSubmit) {
      onSubmit(paymentMethod)
    }
  }

  return (
    <div className="flex flex-col w-full gap-2 mt-6 border rounded-md">
      <div className="p-4 bg-muted/60">
        <Label className="text-md">{t('paymentMethod.title')}</Label>
      </div>
      <div className='grid grid-cols-2'>

        <div className='flex flex-col col-span-1'>
          <div className="p-4">
            <PaymentMethodRadioGroup onSubmit={handlePaymentMethodSubmit} />
          </div>
          <div className="flex items-center gap-1 px-4 pb-4 text-[0.5rem] text-muted-foreground">
            <CircleAlert size={12} className="text-blue-500" />
            {t('paymentMethod.bankTransferProcessing')}
          </div>
        </div>
        <div className='col-span-1 pb-4'>
          {qrCode && (
            <div className="flex flex-col items-center justify-center">
              <img src={qrCode} alt="QR Code" className="w-2/5" />
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='text-sm'>
                  {t('paymentMethod.total')}<span className='text-lg font-bold'>{total?.toLocaleString()}đ</span>
                </div>
                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <CircleAlert size={12} className="text-blue-500" />
                  {t('paymentMethod.paymentNote')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
