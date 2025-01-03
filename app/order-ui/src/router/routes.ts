import {
  Banknote,
  Bolt,
  ChartColumn,
  ClipboardList,
  CookingPot,
  FileChartColumnIncreasing,
  FileText,
  Grid2x2,
  LayoutGrid,
  Phone,
  ShoppingBag,
  Store,
  Users,
} from 'lucide-react'

import type { ISidebarRoute } from '@/types'
import { Role, ROUTE } from '@/constants'

export const sidebarRoutes: ISidebarRoute[] = [
  // {
  //   title: 'sidebar.home',
  //   path: ROUTE.HOME,
  //   icon: SquareTerminal,
  //   roles: [Role.ADMIN, Role.CUSTOMER],
  // },
  {
    title: 'sidebar.menu',
    path: ROUTE.STAFF_MENU,
    icon: LayoutGrid,
    roles: [Role.ADMIN, Role.STAFF, Role.CUSTOMER],
  },
  {
    title: 'sidebar.orderManagement',
    path: ROUTE.STAFF_ORDER_MANAGEMENT,
    roles: [Role.MANAGER, Role.ADMIN],
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.orderHistory',
    path: ROUTE.STAFF_ORDER_HISTORY,
    roles: [Role.MANAGER, Role.ADMIN],
    icon: FileText,
  },
  {
    title: 'sidebar.tableManagement',
    path: ROUTE.STAFF_TABLE_MANAGEMENT,
    roles: [Role.MANAGER, Role.ADMIN],
    icon: Grid2x2,
  },
  // {
  //   title: 'sidebar.internalWallet',
  //   path: ROUTE.STAFF_WALLET_MANAGEMENT,
  //   icon: Wallet,
  // },
  {
    title: 'sidebar.menuManagement',
    path: ROUTE.STAFF_MENU_MANAGEMENT,
    roles: [Role.MANAGER, Role.ADMIN],
    icon: ClipboardList,
  },
  {
    title: 'sidebar.dishManagement',
    path: ROUTE.STAFF_PRODUCT_MANAGEMENT,
    roles: [Role.MANAGER, Role.ADMIN],
    icon: CookingPot,
  },
  {
    title: 'sidebar.userManagement',
    path: ROUTE.STAFF_USER_MANAGEMENT,
    roles: [Role.ADMIN],
    icon: Users,
  },
  {
    title: 'sidebar.branchManagement',
    path: ROUTE.STAFF_BRANCH,
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    icon: Store,
  },
  {
    title: 'sidebar.revenueManagement',
    path: ROUTE.STAFF_REVENUE,
    roles: [Role.ADMIN, Role.SUPER_ADMIN, Role.MANAGER],
    icon: ChartColumn,
  },
  {
    title: 'sidebar.staticPageManagement',
    path: ROUTE.STAFF_STATIC_PAGE,
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.logManagement',
    path: ROUTE.STAFF_LOG_MANAGEMENT,
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.bankConfig',
    path: ROUTE.STAFF_BANK_CONFIG,
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    icon: Banknote,
  },
  {
    title: 'sidebar.config',
    path: ROUTE.ADMIN_CONFIG,
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    icon: Bolt,
  },
  {
    title: 'sidebar.myOrders',
    path: ROUTE.CLIENT_ORDER_HISTORY,
    roles: [Role.CUSTOMER],
    icon: ShoppingBag,
  },
  {
    title: 'sidebar.aboutMe',
    path: ROUTE.ABOUT,
    roles: [Role.CUSTOMER],
    icon: FileText,
  },
  {
    title: 'sidebar.contact',
    path: ROUTE.CONTACT,
    roles: [Role.CUSTOMER],
    icon: Phone,
  },
]
