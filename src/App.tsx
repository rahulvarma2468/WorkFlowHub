import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import DashboardPage from './app/page';
import WorkflowsPage from './app/workflows/page';
import AnalyticsPage from './app/analytics/page';
import SettingsPage from './app/settings/page';
import AuthPage from './app/auth/page';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/workflows" 
        element={
          <ProtectedLayout>
            <WorkflowsPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedLayout>
            <AnalyticsPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedLayout>
            <SettingsPage />
          </ProtectedLayout>
        } 
      />
    </Routes>
  );
}

export default App;
