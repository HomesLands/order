import React from 'react'

// Layout
export const StaffLayout = React.lazy(() =>
  import('@/app/layouts').then((module) => ({
    default: module.StaffLayout
  }))
)

//Views
export const HomePage = React.lazy(() =>
  import('@/app/system/home').then((module) => ({
    default: module.HomePage
  }))
)
