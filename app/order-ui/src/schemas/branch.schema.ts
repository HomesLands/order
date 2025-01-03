import { z } from 'zod'

export const createBranchSchema = z.object({
  name: z.string(),
  address: z.string(),
})

export const updateBranchSchema = z.object({
  slug: z.string(),
  name: z.string(),
  address: z.string(),
})

export type TCreateBranchSchema = z.infer<typeof createBranchSchema>
export type TUpdateBranchSchema = z.infer<typeof updateBranchSchema>
