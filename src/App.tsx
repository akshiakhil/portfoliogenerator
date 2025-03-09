import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { AuthForm } from './components/AuthForm';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PortfolioView } from './pages/PortfolioView';
import { Toaster } from 'sonner';
import { PortfolioBuilder } from './pages/PortfolioBuilder';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/portfolio/:id" element={<PortfolioView />} />
          <Route path="/signin" element={<AuthForm type="signin" />} />
          <Route path="/signup" element={<AuthForm type="signup" />} />
          <Route path="/builder" element={
            <ProtectedRoute>
              <PortfolioBuilder />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;