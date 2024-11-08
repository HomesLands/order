import { createBrowserRouter } from 'react-router-dom'

// import { Authority, ROUTE } from '@/constants'
import { Suspense } from 'react'
import { SkeletonCard } from '@/components/app/skeleton'
import { SuspenseElement } from '@/components/app/elements'
import { ROUTE } from '@/constants'
import { HomePage, StaffLayout } from './loadable'

export const router = createBrowserRouter([
  // { path: ROUTE.LOGIN, element: <SuspenseElement component={LoginPage} /> },
  // { path: ROUTE.REGISTER, element: <SuspenseElement component={RegisterPage} /> },
  {
    path: ROUTE.STAFF_HOME,
    element: (
      <Suspense fallback={<SkeletonCard />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
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
