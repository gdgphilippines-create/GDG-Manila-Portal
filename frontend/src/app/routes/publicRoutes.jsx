import UserView from '@/views/user/UserView'
import ProgramPage from '@/views/program/ProgramPage'

export const publicRoutes = [
  {
    path: '/',
    element: <UserView />,
  },
  {
    path: '/events/:eventId/program',
    element: <ProgramPage />,
  },
]
