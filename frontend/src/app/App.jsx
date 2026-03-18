import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { ROLES } from '@/core/constants/roles'
import { AdminAlertsRoute, AdminStreamRoute, ProgramManageView } from '@/features/admin'
import ProtectedRoute from '@/components/guards/ProtectedRoute'
import { useAuth } from './hooks'
import { AuthProvider } from './providers'
import { publicRoutes } from './routes/publicRoutes'
import AdminOverviewView from '@/views/admin/AdminOverviewView'
import AdminView from '@/views/admin/AdminView'

const appRoutes = [
  ...publicRoutes,
  {
    path: '/admin-panel',
    isProtected: true,
    allowedRoles: [ROLES.ADMIN],
    element: <AdminView />,
    children: [
      {
        index: true,
        element: <Navigate replace to="overview" />,
      },
      {
        path: 'overview',
        element: <AdminOverviewView />,
      },
      {
        path: 'program',
        element: <ProgramManageView />,
      },
      {
        path: 'stream',
        element: <AdminStreamRoute />,
      },
      {
        path: 'alerts',
        element: <AdminAlertsRoute />,
      },
    ],
  },
]

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

function renderRoutes(routes) {
  return routes.map((route, index) => renderRoute(route, route.path ?? `route-${index}`))
}

function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

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

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate>
          <Routes>{renderRoutes(appRoutes)}</Routes>
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  )
}
