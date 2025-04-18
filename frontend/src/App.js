import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import MarathonDetail from './pages/MarathonDetail';
import MarathonForm from './pages/MarathonForm';
import ProtectedRoute from './components/ProtectedRoute';
import InviteMembers from './pages/InviteMembers';
import Users from './pages/Users';
import NotFound from './components/NotFound';
import Participants from './pages/Participants';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/marathon/:id" element={<MarathonDetail />} />
            <Route path="/users" element={<Users />} />
            <Route path="/participants" element={<Participants />}/>
            {/* Protected admin routes */}
            <Route
              path="/admin/marathon/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MarathonForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/marathon/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MarathonForm />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/invite-members" element={<ProtectedRoute allowedRoles={['admin']}>
              <InviteMembers />
            </ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
