import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldAlert, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

interface AdminAuthProps {
  onBackToStore: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onBackToStore }) => {
  const { loginWithEmail, registerWithEmail, loginDemoAdmin } = useAuth();
  const { settings } = useRestaurant();
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Email ou senha incorretos. Verifique suas credenciais.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este email já está cadastrado. Faça login ou use outro.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErrorMsg(err.message || 'Erro ao realizar login no Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginDemoAdmin();
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          id="btn-back-to-store-from-login"
          onClick={onBackToStore}
          className="text-neutral-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Cardápio do Cliente</span>
        </button>

        <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
          Acesso Restrito
        </span>
      </div>

      {/* Login Card */}
      <div 
        id="admin-auth-card"
        className="w-full max-w-md bg-neutral-800/90 border border-neutral-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6"
      >
        {/* Branding & Title */}
        <div className="text-center space-y-2">
          <div 
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Painel Administrativo
          </h2>
          <p className="text-xs text-neutral-400">
            {settings.visual.restaurantName} • Gestão de Pedidos e Cardápio
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Email do Administrador
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurante.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-submit-auth"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Entrando...' : isRegistering ? 'Criar Conta Administrador' : 'Entrar no Painel'}</span>
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            id="btn-toggle-auth-mode"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg('');
            }}
            className="text-xs text-neutral-400 hover:text-neutral-200 underline"
          >
            {isRegistering ? 'Já possui conta? Fazer Login' : 'Primeiro acesso? Cadastrar Administrador'}
          </button>
        </div>

        {/* Divider & Instant Demo Access */}
        <div className="pt-3 border-t border-neutral-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Ambiente de Avaliação</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Firebase Configurado
            </span>
          </div>

          <button
            type="button"
            id="btn-demo-admin-login"
            onClick={handleDemoAccess}
            className="w-full py-2.5 px-4 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-neutral-600"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Entrar com Modo de Demonstração (Sem Senha)</span>
          </button>
          <p className="text-[11px] text-neutral-500 text-center">
            Permite testar e interagir instantaneamente com o Kanban, pedidos, cardápio e relatórios.
          </p>
        </div>
      </div>
    </div>
  );
};
