import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App'

// Apply persisted language direction on initial load
const lang = localStorage.getItem('lang') ?? 'en'
document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
document.documentElement.lang = lang

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
