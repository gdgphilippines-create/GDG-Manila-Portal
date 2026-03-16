import { Navigate } from 'react-router-dom'
import { ROLES } from '@/core/constants/roles'
import {
  AdminAlertsRoute,
  AdminInsightsRoute,
  AdminOverviewRoute,
  ProgramManageView,
} from '@/features/admin'
import ProgramPage from '@/views/program/ProgramPage'
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
        isProtected: true,
        element: (
          <ProgramManageView>
            <ProgramPage isAdmin withPageShell={false} />
          </ProgramManageView>
        ),
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
