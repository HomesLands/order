// import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'

// import { ROUTE } from '@/constants'
// import { useAuthStore, useUserInfoPermissionsStore, useUserStore } from '@/stores'
// import { useCallback, useEffect } from 'react'

// export default function ProtectedElement({
//   element,
//   allowedAuthorities
// }: {
//   element: React.ReactNode
//   allowedAuthorities: string[]
// }) {
//   const { isAuthenticated, setLogout } = useAuthStore()
//   const { t } = useTranslation('auth')
//   const { removeUserInfo } = useUserStore()
//   const { clearUserRoles, userRoles } = useUserInfoPermissionsStore()
//   const navigate = useNavigate()

//   const handleLogout = useCallback(() => {
//     setLogout()
//     removeUserInfo()
//     clearUserRoles()
//     // toast.error(t('sessionExpired'))
//     navigate(ROUTE.LOGIN)
//   }, [setLogout, removeUserInfo, clearUserRoles, navigate])

//   const hasRequiredPermissions = useCallback(() => {
//     // return userRoles.some((userRole) =>
//     //   userRole.authorities.some((authority) => allowedAuthorities.includes(authority))
//     // )
//     return true
//   }, [userRoles, allowedAuthorities])

//   // Check authentication and permissions
//   useEffect(() => {
//     if (!isAuthenticated()) {
//       handleLogout()
//     } else if (!hasRequiredPermissions()) {
//       // toast.error(t('accessDenied')) // Using translation for error message
//       navigate(ROUTE.HOME)
//     }
//     // Make sure to include necessary dependencies
//   }, [isAuthenticated, navigate, handleLogout, hasRequiredPermissions, t])

//   const hasAccess = isAuthenticated() && hasRequiredPermissions()

//   return hasAccess ? <>{element}</> : null
// }
