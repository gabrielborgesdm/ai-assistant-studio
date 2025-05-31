import './styles/globals.css'
import './styles/shared.css'

import { AssistantProvider } from './provider/AssistantProvider'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './provider/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AssistantProvider>
      <ThemeProvider storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </AssistantProvider>
  </StrictMode>
)
