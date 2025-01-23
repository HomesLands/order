import { useCartItemStore } from '@/stores'
import { OrderTypeEnum } from '@/types'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactSelect, { SingleValue } from 'react-select'

interface OrderTypeSelectProps {
  orderType?: string
}

export default function OrderTypeSelect({ orderType }: OrderTypeSelectProps) {
  const { t } = useTranslation('menu')
  const { addOrderType, removeTable, getCartItems } = useCartItemStore()
  const [orderTypes] = useState<{ value: string; label: string }[]>(() => {
    return [
      {
        value: OrderTypeEnum.AT_TABLE,
        label: t('menu.dineIn'),
      },
      {
        value: OrderTypeEnum.TAKE_OUT,
        label: t('menu.takeAway'),
      },
    ]
  })
  const [selectedType, setSelectedType] = useState<{
    value: string
    label: string
  } | null>(null)

  useEffect(() => {
    const cartItems = getCartItems()
    if (cartItems?.type) {
      const result = orderTypes.find((type) => type.value === cartItems.type)
      if (result) {
        setSelectedType(result)
      }
    }
  }, [getCartItems, orderTypes])

  const handleChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
  ) => {
    if (selectedOption) {
      setSelectedType(selectedOption)
      if (selectedOption.value === OrderTypeEnum.TAKE_OUT) {
        removeTable()
      }
      addOrderType(selectedOption.value as OrderTypeEnum)
    }
  }

  return (
    <ReactSelect
      placeholder={t('menu.selectOrderType')}
      defaultValue={orderType ? orderTypes.find((type) => type.value === orderType) : null}
      className="w-full text-sm border-muted-foreground text-muted-foreground"
      value={selectedType}
      options={orderTypes}
      onChange={handleChange}
    />
  )
}
