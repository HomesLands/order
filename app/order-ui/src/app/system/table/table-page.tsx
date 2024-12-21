import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core'
import { ImageIcon } from '@radix-ui/react-icons'

import { CreateTableDialog } from '@/components/app/dialog'
import { Button } from '@/components/ui'
import { useTables, useUpdateTable, useUpdateTableStatus } from '@/hooks'
import { TableItem } from './table-item'
import { useUserStore } from '@/stores'
import TableContextMenu from './table-context-menu'
import { useQueryClient } from '@tanstack/react-query'
import { showToast } from '@/utils'
import { TableStatus } from '@/constants'

export default function TablePage() {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['table'])
  const { t: tToast } = useTranslation(['toast'])
  const { getUserInfo } = useUserStore()
  const { data: tables } = useTables(getUserInfo()?.branch.slug)
  const { mutateAsync: updateTable } = useUpdateTable()
  // const { mutate: deleteTable } = useDeleteTable()
  const { mutate: updateTableStatus } = useUpdateTableStatus()
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [tablePositions, setTablePositions] = useState<{
    [key: string]: { x: number; y: number }
  }>({})
  const [tableSizes, setTableSizes] = useState<{
    [key: string]: { width: number; height: number }
  }>({})
  const mapRef = useRef<HTMLDivElement>(null)
  const tableData = tables?.result

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Tăng distance để drag mượt hơn
        distance: 4,
        // Thêm delay để tránh việc drag không chủ ý
        delay: 100,
      },
    }),
  )

  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    tableId: string
  }>({
    show: false,
    x: 0,
    y: 0,
    tableId: '',
  })

  const handleContextMenu = (e: React.MouseEvent, tableId: string) => {
    e.preventDefault()

    // Calculate position
    const x = e.clientX
    const y = e.clientY

    // Get viewport dimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Adjust position if too close to viewport edges
    const adjustedX = x + 192 > viewportWidth ? x - 192 : x
    const adjustedY = y + 200 > viewportHeight ? y - 200 : y

    setContextMenu({
      show: true,
      x: adjustedX,
      y: adjustedY,
      tableId,
    })
  }

  const handleStatusChange = (tableId: string, status: TableStatus) => {
    // Implement status change logic here
    updateTableStatus(
      { slug: tableId, status },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['tables', getUserInfo()?.branch.slug],
          })
          showToast(tToast('toast.updateTableStatusSuccess'))
        },
        // onError: (error) => {
        //   if (isAxiosError(error)) {
        //     const axiosError = error as AxiosError<IApiResponse<void>>
        //     if (axiosError.response?.data.code)
        //       showErrorToast(axiosError.response.data.code)
        //   }
        // },
      },
    )
    setContextMenu({ show: false, x: 0, y: 0, tableId: '' })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(imageUrl)
    }
  }

  const handleTableResize = (
    tableId: string,
    size: { width: number; height: number },
  ) => {
    setTableSizes((prev) => ({
      ...prev,
      [tableId]: size,
    }))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta } = event
    const draggedTable = tables?.result.find((t) => t.slug === active.id)
    if (!draggedTable || !mapRef.current) return

    const mapRect = mapRef.current.getBoundingClientRect()
    const tableSize = tableSizes[active.id] || { width: 80, height: 80 }

    // Calculate new position
    const newX =
      (tablePositions[active.id]?.x ?? draggedTable.xPosition ?? 0) + delta.x
    const newY =
      (tablePositions[active.id]?.y ?? draggedTable.yPosition ?? 0) + delta.y

    // Constrain within map boundaries, considering actual table size
    const constrainedX = Math.max(
      0,
      Math.min(newX, mapRect.width - tableSize.width),
    )
    const constrainedY = Math.max(
      0,
      Math.min(newY, mapRect.height - tableSize.height),
    )

    // Update local state
    setTablePositions((prev) => ({
      ...prev,
      [active.id]: { x: constrainedX, y: constrainedY },
    }))

    try {
      await updateTable({
        slug: draggedTable.slug,
        name: draggedTable.name,
        location: draggedTable.location,
        xPosition: constrainedX,
        yPosition: constrainedY,
      })
    } catch (error) {
      console.error('Failed to update table position:', error)
      setTablePositions((prev) => ({
        ...prev,
        [active.id]: {
          x: draggedTable.xPosition ?? 0,
          y: draggedTable.yPosition ?? 0,
        },
      }))
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-end gap-2 py-4">
        <div>
          <label htmlFor="bg-image-upload">
            <Button variant="outline" className="gap-2" asChild>
              <div>
                <ImageIcon className="w-4 h-4" />
                {t('table.uploadBackgroundImage')}
              </div>
            </Button>
          </label>
          <input
            id="bg-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <CreateTableDialog />
      </div>

      <div className="relative flex-1 border rounded-md">
        <div className="flex flex-row gap-4 p-4">
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 border rounded-sm bg-muted-foreground/10" />
            <span className="text-sm">{t('table.available')}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-500 rounded-sm" />
            <span className="text-sm">{t('table.reserved')}</span>
          </div>
        </div>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            ref={mapRef}
            className="relative w-full h-full"
            style={{
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {tables?.result.map((table) => (
              <TableItem
                key={table.slug}
                table={table}
                position={tablePositions[table.slug]}
                onContextMenu={(e) => handleContextMenu(e, table.slug)}
                onResize={(size) => handleTableResize(table.slug, size)}
                size={tableSizes[table.slug]}
                containerBounds={mapRef.current?.getBoundingClientRect()}
              />
            ))}
          </div>
        </DndContext>
        {contextMenu.show && (
          <TableContextMenu
            open={contextMenu.show}
            x={contextMenu.x}
            y={contextMenu.y}
            table={
              tableData?.find((t) => t.slug === contextMenu.tableId) || null
            }
            onOpenChange={(open) =>
              setContextMenu((prev) => ({ ...prev, show: open }))
            }
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  )
}
