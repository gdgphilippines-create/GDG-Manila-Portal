import { Navigate } from 'react-router-dom'
import { ROLES } from '@/core/constants/roles'
import {
  AdminAlertsRoute,
  AdminInsightsRoute,
  AdminOverviewRoute,
  AdminProgramRoute,
} from '@/features/admin'
import AdminView from '@/views/admin/AdminView'

export const adminRoutes = [
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
        element: <AdminOverviewRoute />,
      },
      {
        path: 'program',
        element: <AdminProgramRoute />,
      },
      {
        path: 'alerts',
        element: <AdminAlertsRoute />,
      },
      {
        path: 'insights',
        element: <AdminInsightsRoute />,
      },
    ],
  },
]
