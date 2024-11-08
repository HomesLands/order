import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { has } from 'lodash'

import '@/assets/index.css'
import { router } from '@/router'
import '@/i18n'
import { AxiosError, isAxiosError } from 'axios'
import { IApiResponse } from '@/types'
import { showErrorToast } from '@/utils'
// import { ThemeProvider } from '@/components/theme-provider'

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (has(query.meta, 'ignoreGlobalError')) if (query.meta.ignoreGlobalError) return
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<IApiResponse<void>>
        if (axiosError.response?.data.code) showErrorToast(axiosError.response.data.code)
      }
    }
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => {
      console.log({ error })
      if (has(mutation.meta, 'ignoreGlobalError')) if (mutation.meta.ignoreGlobalError) return
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<IApiResponse<void>>
        if (axiosError.response?.data.code) showErrorToast(axiosError.response.data.code)
        return
      }
    }
  })
})

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  )
}

export default App
