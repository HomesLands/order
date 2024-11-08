import { useQuery } from '@tanstack/react-query'

import { getDishes } from '@/api'

export const useDishes = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: () => getDishes()
  })
}
