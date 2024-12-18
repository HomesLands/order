import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useTables } from '@/hooks'
import { useCartItemStore } from '@/stores'
import { useUserStore } from '@/stores'
import { ITable } from '@/types'
import { TableItem } from '../table/table-item'
import SelectReservedTableDialog from '@/components/app/dialog/select-reserved-table-dialog'

export default function TableSelect() {
  const { t } = useTranslation(['table'])
  const { getUserInfo } = useUserStore()
  const { data: tables } = useTables(getUserInfo()?.branch.slug)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const { getCartItems, addTable, removeTable } = useCartItemStore()
  const cartItems = getCartItems()
  const [reservedTable, setReservedTable] = useState<ITable | null>(null)

  useEffect(() => {
    const addedTable = cartItems?.table
    if (addedTable) {
      setSelectedTableId(addedTable)
    }
  }, [cartItems])

  const handleTableClick = (table: ITable) => {
    if (selectedTableId === table.slug) {
      // Remove table for any status
      setSelectedTableId(null)
      removeTable()
    } else {
      if (table.status === 'reserved') {
        setReservedTable(table) // Show confirmation dialog
      } else if (table.status === 'available') {
        setSelectedTableId(table.slug)
        addTable(table)
      }
    }
  }

  const confirmAddReservedTable = (table: ITable) => {
    setSelectedTableId(table.slug)
    addTable(table)
    setReservedTable(null) // Close the dialog
  }

  return (
    <div className="flex flex-col w-full mt-6 border rounded-md">
      <div className="flex flex-col items-start justify-between gap-2 p-4 sm:flex-row bg-muted/60">
        <span className="font-medium text-md">{t('table.title')}</span>
        <div className="flex gap-2 text-xs sm:gap-4 sm:px-4 sm:flex-row">
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 border rounded-sm bg-muted-foreground/10" />
            <span className="sm:text-sm">{t('table.available')}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-sm" />
            <span className="sm:text-sm">{t('table.reserved')}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-500 rounded-sm bg-muted-foreground/10" />
            <span className="sm:text-sm">{t('table.selected')}</span>
          </div>
        </div>
      </div>
      <div className="relative flex min-h-[26rem] flex-col overflow-x-auto">
        {tables?.result.map((table) => (
          <TableItem
            key={table.slug}
            table={table}
            isSelected={selectedTableId === table.slug}
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => handleTableClick(table)}
          />
        ))}
      </div>
      {reservedTable && (
        <SelectReservedTableDialog
          table={reservedTable}
          setSelectedTableId={setSelectedTableId}
          onConfirm={confirmAddReservedTable}
          onCancel={() => setReservedTable(null)} // Close dialog on cancel
        />
      )}
    </div>
  )
}
