import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './responsive.css'
import App from './App.tsx'

document.documentElement.classList.remove('dark')

const liveUrl = `${window.location.origin}${window.location.pathname}`
const canonicalLink = document.getElementById('canonical-link') as HTMLLinkElement | null
if (canonicalLink) {
  canonicalLink.href = liveUrl
}

const ogUrl = document.getElementById('og-url')
if (ogUrl) {
  ogUrl.setAttribute('content', liveUrl)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
