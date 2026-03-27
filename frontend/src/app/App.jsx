import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '@/components/layout'
import { ToastViewport } from '@/components/ui'
import { useAuth } from '@/app/hooks'
import { AuthProvider } from '@/app/providers'
import { notificationsService } from '@/services/notifications'
import { routes } from './routes'

function getRouteElement(route) {
  const { allowedRoles, element, isProtected } = route

  if (!isProtected) {
    return element
  }

  if (!allowedRoles?.length) {
    return <ProtectedRoute>{element}</ProtectedRoute>
  }

  return <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
}

function renderRoute(route, key) {
  const { children, index, path } = route

  return (
    <Route element={getRouteElement(route)} index={index} key={key} path={path}>
      {children?.map((childRoute, childIndex) =>
        renderRoute(childRoute, `${key}:${childRoute.index ? 'index' : childRoute.path ?? childIndex}`),
      )}
    </Route>
  )
}

function renderRoutes(routeList) {
  return routeList.map((route, index) => renderRoute(route, route.path ?? `route-${index}`))
}

function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const shouldRenderToasts =
    location.pathname !== '/login' &&
    !location.pathname.startsWith('/admin-panel') &&
    !location.pathname.startsWith('/facilitator')

  if (loading) {
    return (
      <div className="type-body layout-page flex items-center justify-center text-muted">
        Checking session...
      </div>
    )
  }

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return (
    <>
      {children}
      {shouldRenderToasts ? <ToastViewport /> : null}
    </>
  )
}

export default function App() {
  useEffect(() => {
    void notificationsService.initialize()
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate>
          <Routes>{renderRoutes(routes)}</Routes>
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  )
}
