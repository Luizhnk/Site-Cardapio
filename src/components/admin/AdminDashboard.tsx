import React, { useState } from 'react';
import { 
  Inbox, 
  Utensils, 
  Palette, 
  Truck, 
  Settings, 
  BarChart3, 
  LogOut, 
  Store, 
  CheckCircle2, 
  Radio, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { KanbanBoard } from './KanbanBoard';
import { MenuManager } from './MenuManager';
import { VisualIdentityManager } from './VisualIdentityManager';
import { DeliveryFeeManager } from './DeliveryFeeManager';
import { SettingsManager } from './SettingsManager';
import { ReportsManager } from './ReportsManager';

type AdminTab = 'kanban' | 'menu' | 'visual' | 'delivery' | 'settings' | 'reports';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { currentUser, isDemoAdmin, logout } = useAuth();
  const { settings, orders } = useRestaurant();
  const [activeTab, setActiveTab] = useState<AdminTab>('kanban');

  const primaryColor = settings.visual.primaryColor || '#E11D48';

  const pendingOrdersCount = orders.filter(o => o.status === 'recebido' || o.status === 'em_preparo').length;

  const NAV_ITEMS: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: 'kanban', label: 'Pedidos (Kanban)', icon: Inbox, badge: pendingOrdersCount },
    { id: 'menu', label: 'Cardápio', icon: Utensils },
    { id: 'visual', label: 'Identidade Visual', icon: Palette },
    { id: 'delivery', label: 'Taxas de Entrega', icon: Truck },
    { id: 'settings', label: 'Horários & Ajustes', icon: Settings },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-neutral-900 text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand & Mode info */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 flex items-center justify-center">
              {settings.visual.logoUrl ? (
                <img src={settings.visual.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-none">
                  {settings.visual.restaurantName}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Painel Admin
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firebase Conectado
                </span>
                <span>•</span>
                <span>{isDemoAdmin ? 'Admin Demo' : currentUser?.email || 'Administrador'}</span>
              </div>
            </div>
          </div>

          {/* Right Action buttons: View store & Logout */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-admin-switch-to-store"
              onClick={onBackToStore}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 transition-colors flex items-center gap-1.5 border border-neutral-700"
              title="Abrir a visão do cliente"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Ver Cardápio do Cliente</span>
            </button>

            <button
              id="btn-admin-logout"
              onClick={() => logout()}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none flex items-center gap-1 pt-1">
          {NAV_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`admin-nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-rose-500 text-white bg-neutral-800/60'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'visual' && <VisualIdentityManager />}
        {activeTab === 'delivery' && <DeliveryFeeManager />}
        {activeTab === 'settings' && <SettingsManager />}
        {activeTab === 'reports' && <ReportsManager />}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-neutral-200 text-center text-xs text-neutral-400">
        Painel Administrativo • {settings.visual.restaurantName}
      </footer>
    </div>
  );
};
