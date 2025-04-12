import { StrictMode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import '@fontsource/lusitana/700.css'
import '@fontsource/inter'
import './index.css'
import App from './App.jsx'
import { NotificationContextProvider } from './contexts/notification.jsx'


const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <NotificationContextProvider>
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Router>
  </NotificationContextProvider>
);
