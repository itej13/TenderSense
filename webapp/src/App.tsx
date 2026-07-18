import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { DataProvider } from './lib/DataContext'
import { SubmissionsProvider } from './lib/SubmissionsContext'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Sector from './pages/Sector'
import Login from './pages/Login'
import AdminReview from './pages/AdminReview'

export default function App() {
  return (
    <AuthProvider>
      <SubmissionsProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/sector/:id" element={<Sector />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin/review"
                  element={
                    <RequireAuth roles={['admin']}>
                      <AdminReview />
                    </RequireAuth>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </SubmissionsProvider>
    </AuthProvider>
  )
}
