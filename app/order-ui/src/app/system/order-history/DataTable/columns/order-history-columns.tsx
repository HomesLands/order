import { NavLink } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, SquareMousePointer, CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import {
  Button,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui'
import { IOrder } from '@/types'
import { ROUTE } from '@/constants'
import { useCreateOrderInvoice, useExportOrderInvoice } from '@/hooks'
import { showToast } from '@/utils'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
import PaymentStatusBadge from '@/components/app/badge/payment-status-badge'

export const useOrderHistoryColumns = (): ColumnDef<IOrder>[] => {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  const { mutate: createOrderInvoice } = useCreateOrderInvoice()
  const { mutate: exportOrderInvoice } = useExportOrderInvoice()
  const handleCreateOrderInvoice = (slug: string) => {
    createOrderInvoice(slug, {
      onSuccess: () => {
        showToast('Create order invoice successfully')
      },
      onError: (error) => {
        console.log('Create order invoice error', error)
      }
    })
  }

  const handleExportOrderInvoice = (slug: string) => {
    exportOrderInvoice(slug, {
      onSuccess: () => {
        showToast('Export order invoice successfully')
      },
      onError: (error) => {
        console.log('Create order invoice error', error)
      }
    })
  }
  return [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('menu.createdAt')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt')
        return (
          <div className='text-sm'>
            {createdAt ? moment(createdAt).format('HH:mm DD/MM/YYYY') : ''}
          </div>
        )
      },
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.slug')} />
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className='text-sm'>
            {order?.slug}
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.status')} />
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <OrderStatusBadge
            status={order?.status}
          />

        )
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.paymentStatus')} />
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <PaymentStatusBadge
            status={order?.invoice?.status}
          />

        )
      },
    },
    {
      accessorKey: 'owner',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.owner')} />
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className='text-sm'>
            {order?.owner?.firstName} {order?.owner?.lastName}
          </div>
        )
      },
    },
    {
      accessorKey: 'subtotal',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.subtotal')} />
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className='text-sm'>
            {order?.subtotal.toLocaleString()}đ
          </div>
        )
      },
    },
    // {
    //   accessorKey: 'orderItems',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t('order.orderItemCount')} />
    //   ),
    //   cell: ({ row }) => {
    //     const order = row.original
    //     return <div className='text-sm'>
    //       {order?.orderItems.length} {t('order.item').toLocaleLowerCase()}
    //     </div>
    //   },
    // },
    // {
    //   accessorKey: 'table',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t('order.tableNumber')} />
    //   ),
    //   cell: ({ row }) => {
    //     const order = row.original
    //     return (
    //       <div className='text-sm'>
    //         {order?.tableName}
    //       </div>
    //     )
    //   },
    // },
    {
      id: 'actions',
      header: tCommon('common.action'),
      cell: ({ row }) => {
        const order = row.original
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                  <span className="sr-only">{tCommon('common.action')}</span>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {tCommon('common.action')}
                </DropdownMenuLabel>
                <NavLink
                  to={`${ROUTE.STAFF_ORDER_HISTORY}/${order.slug}`}
                  className="flex items-center justify-start w-full"
                >
                  <Button
                    variant="ghost"
                    className="flex justify-start w-full gap-1 px-2 text-sm"
                  >
                    <SquareMousePointer className="icon" />
                    {tCommon('common.viewDetail')}
                  </Button>
                </NavLink>
                {!order.payment && (
                  <NavLink
                    to={`${ROUTE.STAFF_ORDER_PAYMENT}/${order.slug}`}
                    className="flex items-center justify-start w-full"
                  >
                    <Button
                      variant="ghost"
                      className="flex justify-start w-full gap-1 px-2 text-sm"
                    >
                      <CreditCard className="icon" />
                      {t('order.updatePayment')}
                    </Button>
                  </NavLink>
                )}
                {!order.payment && (
                  <Button onClick={() => handleCreateOrderInvoice(order.slug)} variant="ghost" className='flex justify-start w-full px-2'>
                    {t('order.createInvoice')}
                  </Button>
                )}
                <Button onClick={() => handleExportOrderInvoice(order?.invoice ? order?.invoice.slug : '')} variant="ghost" className='flex justify-start w-full px-2'>
                  {t('order.exportInvoice')}
                </Button>
                {/* <UpdateMenuDialog menu={menu} /> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
