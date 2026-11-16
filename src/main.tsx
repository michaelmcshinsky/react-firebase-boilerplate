import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { AppProviders } from './app/providers/app-providers'
import { router } from './app/router/router'
import './styles/globals.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root was not found in index.html.')

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
