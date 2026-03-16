import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/app/providers'
import ProtectedRoute from '@/components/guards/ProtectedRoute'
import AdminView from '@/views/admin/AdminView'
import UserView from '@/views/user/UserView'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserView />} />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminView />
              </ProtectedRoute>
            }
            path="/admin-panel"
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
