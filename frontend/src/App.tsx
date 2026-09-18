import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { RedirectIfAuthed, RequireAuth } from './components/RouteGuards'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import PageTransition from './components/layout/PageTransition'
import Cart from './pages/Cart'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import OrderConfirmed from './pages/OrderConfirmed'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Shop from './pages/Shop'
import Signup from './pages/Signup'

/**
 * Application shell and route table.
 *
 * Renders the persistent navbar and footer around the routed page, wrapping
 * each route in <PageTransition> and keying it on the pathname so
 * <AnimatePresence> can cross-fade between pages. Cart, orders, profile and
 * the order-confirmed screen sit behind <RequireAuth>; login and signup sit
 * behind <RedirectIfAuthed>. Any unmatched path renders <NotFound>.
 */
export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/shop"
              element={
                <PageTransition>
                  <Shop />
                </PageTransition>
              }
            />
            <Route
              path="/cart"
              element={
                <PageTransition>
                  <RequireAuth>
                    <Cart />
                  </RequireAuth>
                </PageTransition>
              }
            />
            <Route
              path="/order/confirmed"
              element={
                <PageTransition>
                  <RequireAuth>
                    <OrderConfirmed />
                  </RequireAuth>
                </PageTransition>
              }
            />
            <Route
              path="/orders"
              element={
                <PageTransition>
                  <RequireAuth>
                    <Orders />
                  </RequireAuth>
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <RedirectIfAuthed>
                    <Login />
                  </RedirectIfAuthed>
                </PageTransition>
              }
            />
            <Route
              path="/signup"
              element={
                <PageTransition>
                  <RedirectIfAuthed>
                    <Signup />
                  </RedirectIfAuthed>
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}
