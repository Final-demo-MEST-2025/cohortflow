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
import ProfileLayout from './pages/dashboard/profile/layout' 
import ProfilePage from './pages/dashboard/profile/page'
import ProfileEditPage  from './pages/dashboard/profile/edit/page'
import ClassroomLayout from './pages/dashboard/classrooms/layout'
import ClassroomHome from './pages/dashboard/classrooms/page'


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
              <Route path="/dashboard/users/me" element={<ProfileLayout />} >
                <Route index element={<ProfilePage />} />
                <Route path="/dashboard/users/me/edit" element={<ProfileEditPage />}/>
              </Route>
              <Route element={<ProtectedRoute roles={['admin']} /> }>
                <Route path="/dashboard/users" element={<UsersPage />} />
                <Route path='/dashboard/users/create' element={<CreateUserPage />} />
              </Route>
              <Route path='/dashboard/classrooms' element={<ClassroomLayout />}>
                <Route index element={<ClassroomHome /> } />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App
