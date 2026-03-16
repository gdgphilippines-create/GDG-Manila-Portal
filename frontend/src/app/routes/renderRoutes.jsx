import { Route } from 'react-router-dom'
import ProtectedRoute from '@/components/guards/ProtectedRoute'

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

export function renderRoutes(routes) {
  return routes.map((route, index) => renderRoute(route, route.path ?? `route-${index}`))
}
