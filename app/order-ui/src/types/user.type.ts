export interface IUserInfo {
  slug: string
  image?: string
  phonenumber: string
  firstName: string
  lastName: string
  dob: string
  email: string
  address: string
  branch: {
    slug: string
    name: string
    address: string
  }
  role: {
    slug: string
    name: string
    createdAt: string
    description: string
  }
}

export interface IUpdateProfileRequest {
  firstName: string
  lastName: string
  dob: string
  address: string
  branch: string
}

export interface IUpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}
