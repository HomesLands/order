import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants'
import { useAuthStore, useUserStore } from '@/stores'
import { useCallback, useEffect } from 'react'

export default function ProtectedElement({
  element,
  allowedRoles,
}: {
  element: React.ReactNode
  allowedRoles: string[]
}) {
  const { isAuthenticated, setLogout } = useAuthStore()
  const { t } = useTranslation('auth')
  const { removeUserInfo, userInfo } = useUserStore()
  //   const { clearUserRoles, userRoles } = useUserInfoPermissionsStore()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    setLogout()
    removeUserInfo()
    // clearUserRoles()
    // toast.error(t('sessionExpired'))
    navigate(ROUTE.LOGIN)
  }, [setLogout, removeUserInfo, navigate])

  const hasRequiredPermissions = useCallback(() => {
    if (!userInfo || !allowedRoles) return false;
    const userRole = userInfo.role?.name;
    return allowedRoles.includes(userRole);
  }, [userInfo, allowedRoles]);

  // Check authentication and permissions
  useEffect(() => {
    if (!isAuthenticated()) {
      handleLogout()
    } else if (!hasRequiredPermissions()) {
      // toast.error(t('accessDenied')) // Using translation for error message
      navigate(ROUTE.LOGIN)
    }
    // Make sure to include necessary dependencies
  }, [isAuthenticated, navigate, handleLogout, hasRequiredPermissions, t])

  const hasAccess = isAuthenticated() && hasRequiredPermissions()

  return hasAccess ? <>{element}</> : null
}
