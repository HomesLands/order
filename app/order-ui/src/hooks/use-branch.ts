import { createBranch, getAllBranches, updateBranch } from '@/api'
import { ICreateBranchRequest, IUpdateBranchRequest } from '@/types'
import { useQuery, useMutation } from '@tanstack/react-query'

export const useBranch = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => getAllBranches(),
  })
}

export const useCreateBranch = () => {
  return useMutation({
    mutationFn: async (data: ICreateBranchRequest) => {
      return createBranch(data)
    },
  })
}

export const useUpdateBranch = () => {
  return useMutation({
    mutationFn: async (data: IUpdateBranchRequest) => {
      return updateBranch(data)
    },
  })
}
