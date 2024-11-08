'use client'

import { SidebarProvider } from '@/components/ui'
import { AppHeader, AppSidebar } from '@/components/app'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
