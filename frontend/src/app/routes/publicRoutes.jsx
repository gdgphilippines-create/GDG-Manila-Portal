import LoginView from '@/views/auth/LoginView'
import ProgramPage from '@/views/program/ProgramPage'
import UserView from '@/views/user/UserView'

export const publicRoutes = [
  {
    path: '/',
    element: <UserView />,
  },
  {
    path: '/events/:eventId/program',
    element: <ProgramPage />,
  },
  {
    path: '/login',
    element: <LoginView />,
  },
]
