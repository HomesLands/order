import { SquareTerminal } from 'lucide-react'
import type { ISidebarRoute } from '@/types'
import { ROUTE } from '@/constants'

export const sidebarRoutes: ISidebarRoute[] = [
  {
    title: 'Home page',
    path: ROUTE.STAFF_HOME,
    icon: SquareTerminal,
    children: [
      {
        title: 'Home page',
        path: ROUTE.STAFF_HOME
      }
    ]
  }
]
