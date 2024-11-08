import { Outlet } from 'react-router-dom'

import { SidebarProvider } from '@/components/ui'
import { AppSidebar } from '@/components/app'

export default function ClientLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  )
}
