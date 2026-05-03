import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRouter } from './AppRouter.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import './index.css'
import { ModalProvider } from './context/ModalContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ModalProvider>
        <AppRouter/>
      </ModalProvider>
    </ThemeProvider>
  </StrictMode>,
)
