/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { ClientApp } from './components/client/ClientApp';
import { AdminAuth } from './components/admin/AdminAuth';
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainRouter() {
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');
  const { currentUser, isDemoAdmin, loading } = useAuth();

  const isAuthenticated = !!currentUser || isDemoAdmin;

  if (currentView === 'admin') {
    if (loading) {
      return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span>Verificando autenticação...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminAuth onBackToStore={() => setCurrentView('client')} />;
    }

    return <AdminDashboard onBackToStore={() => setCurrentView('client')} />;
  }

  // Client view
  return <ClientApp onOpenAdmin={() => setCurrentView('admin')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <MainRouter />
      </RestaurantProvider>
    </AuthProvider>
  );
}

