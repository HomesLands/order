import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const ROLE_NOT_FOUND = 'ROLE_NOT_FOUND';

export type TRoleErrorCodeKey = typeof ROLE_NOT_FOUND;
export type TRoleErrorCode = Record<TRoleErrorCodeKey, TErrorCodeValue>;

// 139000 - 139500
export const RoleValidation: TRoleErrorCode = {
  ROLE_NOT_FOUND: createErrorCode(139000, 'Role not found'),
};
