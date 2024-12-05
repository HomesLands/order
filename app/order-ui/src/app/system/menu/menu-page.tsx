import { useState } from 'react'
import moment from 'moment'

import MenuList from './menu-list'
import { CartContent } from '@/router/loadable'
import { CartToggleButton } from '@/components/app/button'
import { CurrentDateInput } from '@/components/app/input'
import { useSidebar } from '@/components/ui'
import { ScrollArea } from '@/components/ui'
import { useIsMobile, useSpecificMenu } from '@/hooks'
import { CartDrawer } from '@/components/app/drawer'
import { useUserStore } from '@/stores'

export default function MenuPage() {
  const [isCartOpen, setIsCartOpen] = useState(true)
  const { state } = useSidebar()
  const isMobile = useIsMobile()
  const isCollapsed = state === 'collapsed'

  const { userInfo } = useUserStore()
  function getCurrentDate() {
    return moment().format('YYYY-MM-DD')
  }
  const { data: specificMenu, isLoading } = useSpecificMenu({
    date: getCurrentDate(),
    branch: userInfo?.branch.slug,
  })

  return (
    <div className="flex flex-row h-full gap-2">
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out ${isCartOpen && !isMobile ? 'w-full md:w-[70%]' : 'w-full'} ${isCollapsed ? 'pl-2' : ''}`}
      >
        {/* Fixed Header Section */}
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 py-3 pr-4 bg-background">
          <CurrentDateInput menu={specificMenu?.result} />
          {/* <MenuCategorySelect /> */}
          {!isMobile && (
            <CartToggleButton
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          )}
          {isMobile && <CartDrawer />}
          {/* <SidebarTrigger /> */}
        </div>

        {/* Scrollable Content Section */}
        <ScrollArea className="flex-1 mt-2">
          <MenuList menu={specificMenu?.result} isLoading={isLoading} isCartOpen={isCartOpen} />
        </ScrollArea>
      </div>

      {/* Cart Section - Fixed */}
      <div
        className={`fixed right-0 h-[calc(100vh-6.5rem)] border-l bg-background transition-all duration-300 ease-in-out ${isCartOpen && !isMobile ? 'w-[25%]' : 'w-0 opacity-0'
          }`}
      >
        {isCartOpen && !isMobile && <CartContent />}
      </div>
    </div>
  )
}
