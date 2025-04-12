import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from './pages/layout'
import Page from './pages/page'
import Layout from './pages/dashboard/layout'
import DashboardHome from './pages/dashboard/page'
import ProtectedRoute from './components/ui/protected-route'
import LoginPage from './pages/login/page'
import Notification from './components/ui/notification'
import UsersPage from './pages/dashboard/users/page'
import CreateUserPage from './pages/dashboard/users/create/page' 


const App = () => {
  return (
    <>
      <Notification />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Page />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute roles={["admin", "instructor", "learner"]} />
            }
          >
            <Route path="dashboard" element={<Layout />}>
              <Route index element={<DashboardHome />} />
              <Route element={<ProtectedRoute roles={['admin']} /> }>
                <Route path="/dashboard/users" element={<UsersPage />} />
                <Route path='/dashboard/users/create' element={<CreateUserPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App
