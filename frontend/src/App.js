import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Elections from './pages/Elections';
import ElectionDetail from './pages/ElectionDetail';
import Vote from './pages/Vote';
import Results from './pages/Results';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminElections from './pages/admin/AdminElections';
import AdminUsers from './pages/admin/AdminUsers';
import CreateElection from './pages/admin/CreateElection';
import NotFound from './pages/NotFound';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import Compliance from './pages/legal/Compliance';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/elections" element={<Elections />} />
                <Route path="/elections/:id" element={<ElectionDetail />} />
                <Route path="/results/:id" element={<Results />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/vote/:id" element={
                  <ProtectedRoute>
                    <Vote />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/elections" element={
                  <AdminRoute>
                    <AdminElections />
                  </AdminRoute>
                } />
                <Route path="/admin/elections/create" element={
                  <AdminRoute>
                    <CreateElection />
                  </AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                } />
                
                {/* Legal Routes */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/compliance" element={<Compliance />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </Web3Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;
