import { Navigate } from 'react-router-dom'
import { ROLES } from '@/constants/roles'
import LoginPage from '@/pages/LoginPage'
import UserPage from '@/pages/UserPage'
import ProgramPage from '@/pages/ProgramPage'
import AdminLayout from '@/pages/admin/AdminLayout'
import OverviewPage from '@/pages/admin/OverviewPage'
import ProgramManagePage from '@/pages/admin/ProgramManagePage'
import AlertsPage from '@/pages/admin/AlertsPage'
import FacilitatorLayout from '@/pages/facilitator/FacilitatorLayout'
import FacilitatorOverviewPage from '@/pages/facilitator/OverviewPage'
import VerificationPage from '@/pages/facilitator/VerificationPage'

export const routes = [
  {
    path: '/',
    element: <UserPage />,
  },
  {
    path: '/events/:eventId/program',
    element: <ProgramPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin-panel',
    isProtected: true,
    allowedRoles: [ROLES.ADMIN],
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="overview" />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
      },
      {
        path: 'program',
        element: <ProgramManagePage />,
      },
      {
        path: 'stream',
        element: <Navigate replace to="/admin-panel/program" />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
    ],
  },
  {
    path: '/facilitator',
    isProtected: true,
    allowedRoles: [ROLES.FACILITATOR, ROLES.ADMIN],
    element: <FacilitatorLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="overview" />,
      },
      {
        path: 'overview',
        element: <FacilitatorOverviewPage />,
      },
      {
        path: 'verification',
        element: <VerificationPage />,
      },
    ],
  },
]
