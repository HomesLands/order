import {
  IApiResponse,
  ICreateSystemConfigRequest,
  ISystemConfig,
  IUpdateSystemConfigRequest,
} from '@/types'
import { http } from '@/utils'

export async function getSystemConfigs(): Promise<
  IApiResponse<ISystemConfig[]>
> {
  const response =
    await http.get<IApiResponse<ISystemConfig[]>>('/system-config')
  return response.data
}

export async function createSystemConfig(
  params: ICreateSystemConfigRequest,
): Promise<IApiResponse<ISystemConfig>> {
  const response = await http.post<IApiResponse<ISystemConfig>>(
    '/system-config',
    params,
  )
  return response.data
}

export async function updateSystemConfigs(
  params: IUpdateSystemConfigRequest,
): Promise<IApiResponse<ISystemConfig>> {
  const response = await http.patch<IApiResponse<ISystemConfig>>(
    `/system-config/${params.slug}`,
    params,
  )
  return response.data
}

export async function deleteSystemConfigs({
  key,
  slug,
}: {
  key: string
  slug: string
}): Promise<IApiResponse<null>> {
  const response = await http.delete<IApiResponse<null>>('/system-config', {
    data: {
      key,
      slug,
    },
  })
  return response.data
}

export async function getSystemConfigByKey({
  key,
  slug,
}: {
  key: string
  slug: string
}): Promise<IApiResponse<ISystemConfig>> {
  const response = await http.get<IApiResponse<ISystemConfig>>(
    `/system-config/specific`,
    {
      params: {
        key,
        slug,
      },
    },
  )
  return response.data
}
