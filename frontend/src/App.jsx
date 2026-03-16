import { BrowserRouter, Routes } from 'react-router-dom'
import { AuthProvider } from '@/app/providers'
import { appRoutes, renderRoutes } from '@/app/routes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>{renderRoutes(appRoutes)}</Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
