/**
 * Browser entry point.
 *
 * Mounts <App> into #root inside the router and the auth and cart providers,
 * which is the nesting order the rest of the app assumes: CartProvider reads
 * auth status, and AuthProvider navigates on session expiry.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import CartProvider from './context/CartProvider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
