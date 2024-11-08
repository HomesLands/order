import { Suspense } from 'react'

export default function SuspenseElement({ component: Component }: { component: React.FC }) {
  return (
    <Suspense>
      <Component />
    </Suspense>
  )
}
