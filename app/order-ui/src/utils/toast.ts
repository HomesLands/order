import toast from 'react-hot-toast'
import i18next from 'i18next'

const errorCodes: { [key: number]: string } = {
  1000: 'toast.productAlreadyExists',
  1001: 'toast.invalidEmail',
  1002: 'toast.pathNotFound',
  1003: 'toast.invalidUsername',
  1004: 'toast.userNotFound',
  1005: 'toast.unableToSaveLoginSession',
  1006: 'toast.userAlreadyExists',
  1007: 'toast.undefinedError',
  1008: 'toast.invalidPassword',
  // 1009: 'toast.invalidFirstName',
  // 1010: 'toast.invalidLastName',
  1011: 'toast.invalidFullName',
  1012: 'toast.invalidToken',
  1013: 'toast.invalidJwtPayload',
  1014: 'toast.tokenNotExpired',
  1015: 'toast.subjectNotExist',
  1016: 'toast.invalidRefreshToken',
  1017: 'toast.sessionExpired',
  1018: 'toast.refreshTokenNotValid',
  1019: 'toast.tokenIatNotExist',
  1020: 'toast.tokenIdNotExist',
  1021: 'toast.tokenExpirationNotExist',
  1022: 'toast.userAssignedNotFound',
  1023: 'toast.unitExisted',
  1024: 'toast.unitNotFound',
  1025: 'toast.codeProductExisted',
  1026: 'toast.invalidProductProvider',
  1027: 'toast.invalidProductName',
  1028: 'toast.invalidProductUnit',
  1029: 'toast.invalidProductCode',
  1030: 'toast.invalidSiteName',
  1031: 'toast.invalidSiteAddress',
  1032: 'toast.invalidSiteManager',
  1033: 'toast.invalidProjectName',
  1034: 'toast.invalidProjectStartDate',
  1035: 'toast.invalidProjectProcess',
  1036: 'toast.invalidProjectDescription',
  1037: 'toast.invalidProjectFileDescription',
  1038: 'toast.invalidProjectManager',
  1039: 'toast.invalidUnitName', //Duplicate with Invalid date format
  1040: 'toast.invalidCompanyName',
  1041: 'toast.invalidCompanyNameExisted',
  1042: 'toast.invalidProductRequisitionFormCodeExisted',
  1043: 'toast.invalidCompanyNotFound',
  1044: 'toast.invalidQuantityUserApproval',
  1045: 'toast.invalidQuantityProductApproval',
  1046: 'toast.invalidProductRequisitionFormStatus',
  1047: 'toast.invalidProductRequisitionFormDate',
  1048: 'toast.invalidProductRequisitionFormDescription',
  1049: 'toast.invalidProductRequisitionFormFile',
  1050: 'toast.invalidProductRequisitionFormManager',
  1051: 'toast.siteNotFound',
  1052: 'toast.projectNotFound',
  1053: 'toast.invalidCreator',
  1054: 'toast.invalidApprovalStatus',
  1055: 'toast.invalidApprovalLogContent',
  1056: 'toast.invalidFormCode',
  1057: 'toast.invalidProductRequisitionFormType',
  1058: 'toast.invalidCompanySlug',
  1059: 'toast.invalidSiteSlug',
  1060: 'toast.invalidProjectSlug',
  1061: 'toast.invalidRequestProductArray',
  1062: 'toast.invalidApprovalUserArray',
  1063: 'toast.invalidFormSlug',
  1064: 'toast.invalidApprovalUserSlug',
  1065: 'toast.invalidProductSlug',
  1066: 'toast.invalidRequestProductQuantity',
  1067: 'toast.invalidAssignedUserApproval',
  1068: 'toast.invalidRoleApproval',
  1069: 'toast.missingUserApproval',
  1070: 'toast.roleNotFound',
  1071: 'toast.authorityNotFound',
  1072: 'toast.permissionNotFound',
  // 1072: 'toast.userRoleExisted',
  1073: 'toast.permissionExisted',
  1074: 'toast.invalidCompanyDirector',
  1075: 'toast.companyDirectorNotFound',
  1076: 'toast.productRequisitionExisted',
  1077: 'toast.invalidResubmitFormReason',
  1078: 'toast.invalidProductQuantity',
  1080: 'toast.invalidUserSLug',
  1081: 'toast.invalidDepartmentSlug',
  1082: 'toast.departmentNotFound',
  1083: 'toast.invalidFormType',
  1084: 'toast.invalidApprovalFormDeadline',
  1086: 'toast.invalidDepartmentDescription',
  1087: 'toast.roleMustStartWithROLE',
  1088: 'toast.invalidUnitSlug',
  1089: 'toast.invalidProductWarehouseQuantity',
  1090: 'toast.warehouseNotFound',
  1091: 'toast.missingAddNewProductWarehouseQuantity',
  1092: 'toast.updateProductQuantityError',
  1093: 'toast.invalidTemporaryRequestProductName',
  1094: 'toast.invalidTemporaryRequestProductQuantity',
  1095: 'toast.invalidTemporaryRequestProductProvider',
  1096: 'toast.invalidTemporaryRequestProductDescription',
  1097: 'toast.invalidProductDescription',
  1098: 'toast.fileNotFound',
  1099: 'toast.departmentNameNormalizeMustEndWithDEPARTMENT',
  1100: 'toast.invalidWarehouseSlug',
  1101: 'toast.invalidWarehouseName',
  1102: 'toast.invalidWarehouseAddress',
  1103: 'toast.invalidDisplayName',
  1104: 'toast.invalidNormalizedName',
  1105: 'toast.invalidFormDescription',
  1106: 'toast.saveFileFailed',
  1108: 'toast.getFileFormRequestFailed',
  1109: 'toast.invalidResourceName',
  1110: 'toast.resourceNotFound',
  1111: 'toast.resourceExisted',
  1112: 'toast.assignedUserApprovalExisted',
  1113: 'toast.invalidNewPassword',
  1114: 'toast.invalidConfirmPassword',
  1115: 'toast.passwordNotMatch',
  1116: 'toast.confirmPasswordNotMatch',
  1117: 'toast.invalidUserDepartmentExisted',
  1119: 'toast.worksheetNotFound',
  1120: 'toast.userDepartmentNotFound',
  1121: 'toast.invalidUserDepartmentSlug',
  1122: 'toast.userRoleNotFound',
  1123: 'toast.invalidDateOfBirth',
  1124: 'toast.invalidGender',
  1125: 'toast.invalidAddress',
  1126: 'toast.invalidPhoneNumber',
  1127: 'toast.assignUserApprovalNotFound',

  4100: 'toast.duplicateEntry',
  // 4100: 'toast.folderNotExisted',
  4101: 'toast.exportDatabaseFailed',

  403: 'toast.accessDenied',
  401: 'toast.loginFailed'
}

export function showToast(message: string) {
  toast.success(i18next.t(message, { ns: 'toast' }))
}

export function showErrorToast(code: number) {
  const messageKey = errorCodes[code] || 'toast.requestFailed'
  toast.error(i18next.t(messageKey, { ns: 'toast' }))
}

export function useErrorToast(code: number) {
  const messageKey = errorCodes[code] || 'toast.requestFailed'
  toast.error(i18next.t(messageKey, { ns: 'toast' }))
}