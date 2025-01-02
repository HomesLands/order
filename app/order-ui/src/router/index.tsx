import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

// import { Authority, ROUTE } from '@/constants'
import { SkeletonCart } from '@/components/app/skeleton'
import { SuspenseElement } from '@/components/app/elements'
import { Role, ROUTE, RoutePermissions } from '@/constants'
import {
  MenuPage,
  StaffLayout,
  LoginPage,
  ConfirmOrderPage,
  TablePage,
  OrderSuccessPage,
  RegisterPage,
  ProductManagementPage,
  LoggerPage,
  ProductDetailPage,
  ProfilePage,
  MenuManagementPage,
  OrderPaymentPage,
  BankConfigPage,
  MenuDetailPage,
  OrderManagementPage,
  OrderHistoryPage,
  OrderDetailPage,
  UserListPage,
  ForgotPasswordPage,
  ConfigPage,
  ForgotPasswordAndResetPasswordPage,
  ClientMenuPage,
  ClientProductDetailPage,
  ClientHomePage,
  ClientCartPage,
  ClientOrderHistoryPage,
  ClientOrderDetailPage,
  ClientProfilePage,
  ClientPaymentPage,
  RevenuePage,
} from './loadable'
import ProtectedElement from '@/components/app/elements/protected-element'
import { ClientLandingLayout, ClientLayout } from '@/app/layouts/client'

export const router = createBrowserRouter([
  { path: ROUTE.LOGIN, element: <SuspenseElement component={LoginPage} /> },
  {
    path: ROUTE.REGISTER,
    element: <SuspenseElement component={RegisterPage} />,
  },
  {
    path: ROUTE.FORGOT_PASSWORD,
    element: <SuspenseElement component={ForgotPasswordPage} />,
  },
  {
    path: `${ROUTE.RESET_PASSWORD}`,
    element: <SuspenseElement component={ForgotPasswordAndResetPasswordPage} />,
  },
  {
    path: ROUTE.STAFF_MENU,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.STAFF, Role.CUSTOMER]}
            element={<SuspenseElement component={MenuPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_CHECKOUT_ORDER,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.STAFF]}
            element={<SuspenseElement component={ConfirmOrderPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_ORDER_PAYMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.STAFF, Role.CUSTOMER]}
            element={<SuspenseElement component={OrderPaymentPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.ORDER_SUCCESS}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.STAFF, Role.CUSTOMER]}
            element={<SuspenseElement component={OrderSuccessPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_ORDER_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.STAFF, Role.CHEF]}
            element={<SuspenseElement component={OrderManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_ORDER_HISTORY,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN]}
            element={<SuspenseElement component={OrderHistoryPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_ORDER_HISTORY}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN]}
            element={<SuspenseElement component={OrderDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_TABLE_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER]}
            element={<SuspenseElement component={TablePage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_PRODUCT_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.MANAGER]}
            element={<SuspenseElement component={ProductManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_PRODUCT_MANAGEMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.MANAGER]}
            element={<SuspenseElement component={ProductDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_MENU_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.MANAGER]}
            element={<SuspenseElement component={MenuManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_MENU_MANAGEMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.MANAGER]}
            element={<SuspenseElement component={MenuDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_USER_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN]}
            element={<SuspenseElement component={UserListPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_REVENUE,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN]}
            element={<SuspenseElement component={RevenuePage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_LOG_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN]}
            element={<SuspenseElement component={LoggerPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_PROFILE,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN]}
            element={<SuspenseElement component={ProfilePage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_BANK_CONFIG}`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN]}
            element={<SuspenseElement component={BankConfigPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.ADMIN_CONFIG}`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN]}
            element={<SuspenseElement component={ConfigPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_HOME,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLandingLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <SuspenseElement component={ClientHomePage} />,
        // element: (
        //   <ProtectedElement
        //     allowedRoles={[Role.CUSTOMER]}
        //     element={<SuspenseElement component={ClientHomePage} />}
        //   />
        // ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_MENU,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <ClientLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <SuspenseElement component={ClientMenuPage} />,
        // element: (
        //   <ProtectedElement
        //     allowedRoles={[Role.CUSTOMER]}
        //     element={<SuspenseElement component={ClientMenuPage} />}
        //   />
        // ),
      },
    ],
  },
  {
    path: `${ROUTE.CLIENT_MENU}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <SuspenseElement component={ClientProductDetailPage} />,
        // element: (
        //   <ProtectedElement
        //     allowedRoles={[Role.CUSTOMER]}
        //     element={<SuspenseElement component={ClientProductDetailPage} />}
        //   />
        // ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_CART,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientCartPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.CLIENT_ORDER_PAYMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientPaymentPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_ORDER_HISTORY,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientOrderHistoryPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.CLIENT_ORDER_HISTORY}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientOrderDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.HOME,
    element: <ClientLandingLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={RoutePermissions[ROUTE.HOME]}
            element={<ClientHomePage />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_PROFILE,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientProfilePage} />}
          />
        ),
      },
    ],
  },
  // {
  //   path: ROUTE.PERSONAL_ACCOUNT,
  //   element: <SuspenseElement component={DashboardLayout} />,
  //   children: [
  //     {
  //       index: true,
  //       element: (
  //         <ProtectedElement
  //           allowedAuthorities={[Authority.READ_USER]}
  //           element={<SuspenseElement component={PersonalAccountPage} />}
  //         />
  //       )
  //     }
  //   ]
  // },
])
