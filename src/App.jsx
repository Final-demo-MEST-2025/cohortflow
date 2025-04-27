import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './pages/layout'
import Page from './pages/page'
import Layout from './pages/dashboard/layout'
import DashboardHome from './pages/dashboard/page'
import ProtectedRoute from './components/ui/protected-route'
import LoginPage from './pages/auth/login-page'
import Notification from './components/ui/notification'
import DeleteConfirmationModal from './feature/delete/delete-confirmation-modal'
import UsersPage from './pages/dashboard/users/page'
import CreateUserPage from './pages/dashboard/users/create/page'
import ProfileLayout from './pages/dashboard/profile/layout' 
import ProfilePage from './pages/dashboard/profile/page'
import ProfileEditPage  from './pages/dashboard/profile/edit/page'
import ClassroomsLayout from './pages/dashboard/classrooms/layout'
import ClassroomsPage from "./pages/dashboard/classrooms/page";
import ClassroomLayout from "./pages/dashboard/classrooms/classroom/layout";
import CreateClassroomPage from "./pages/dashboard/classrooms/create/page";
import ForgotPassword from './pages/auth/forgot-password'
import ResetPassword from './pages/auth/reset-password'
import ProgramCohortPage from './pages/dashboard/programs/page'
import Announcements from './pages/dashboard/classrooms/classroom/announcements/page'
import Assignments from './pages/dashboard/classrooms/classroom/assignments/page'
import Quizzes from './pages/dashboard/classrooms/classroom/quizzes/page'
import Projects from './pages/dashboard/classrooms/classroom/projects/page'
import Courses from './pages/dashboard/classrooms/classroom/courses/page'
import People from './pages/dashboard/classrooms/classroom/people/page'
import NetworkStatusBanner from './components/ui/network-status'
import NetworkStatusMonitor from './components/ui/network-status-banner'
import { QuizProvider } from './contexts/QuizContext'
import QuizLayout from './pages/dashboard/classrooms/classroom/quizzes/layout'
import CreateQuizPage from './pages/dashboard/classrooms/classroom/quizzes/create/page'




const App = () => {
  return (
    <>
      <Notification />
      <NetworkStatusMonitor />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path='/' element={<Page />} />
          <Route path="auth/login" element={<LoginPage />} />
          <Route path= "auth/forgot-password" element= {<ForgotPassword/>} />
          <Route path= "auth/reset-password" element= {<ResetPassword/>}/>
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

              <Route path='/dashboard/classrooms' element={<ClassroomsLayout />}>
                <Route index element={<ClassroomsPage /> } />
                <Route path='/dashboard/classrooms/create' element={<CreateClassroomPage />} />
                <Route path='/dashboard/classrooms/:id/edit' element={<CreateClassroomPage />} />
                <Route path='/dashboard/classrooms/:id' element={<ClassroomLayout />}>
                  <Route index element={<Announcements />} />
                  <Route path='/dashboard/classrooms/:id/assignments' element={<Assignments />} />
                  <Route path='/dashboard/classrooms/:id/projects' element={<Projects />} />
                  <Route path='/dashboard/classrooms/:id/courses' element={<Courses />} />
                  <Route path='/dashboard/classrooms/:id/people' element={<People />} />
                  <Route path='/dashboard/classrooms/:id/quizzes' element={<QuizLayout />} >
                    {/* Quiz provider provide context to quiz routes */}
                    <Route element={<QuizProvider />}>
                      <Route index element={<Quizzes />} />
                      <Route element={<ProtectedRoute roles={["admin", "instructor"]} />}>
                        <Route path='/dashboard/classrooms/:id/quizzes/create' element={<CreateQuizPage />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>

              {/* Only Admin Role */}
              <Route element={<ProtectedRoute roles={['admin']} /> }>
                <Route path="/dashboard/users" element={<UsersPage />} />
                <Route path='/dashboard/users/create' element={<CreateUserPage />} />
                <Route path='/dashboard/programs' element={<ProgramCohortPage/> } />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DeleteConfirmationModal />
    </>
  );
}

export default App
