import { IDish } from '@/types'
import { dishes } from '@/data/dishes'
import { sleep } from '@/lib'

export async function getDishes(): Promise<IDish[]> {
  await sleep(1000)

  return dishes
}
