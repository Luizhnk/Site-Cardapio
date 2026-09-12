import React from 'react';
import { ShoppingBag, Clock, MapPin, ShieldCheck, Phone } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/whatsapp';

interface ClientHeaderProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ onOpenCart, onOpenAdmin }) => {
  const { settings, storeStatus, cartCount, cartSubtotal } = useRestaurant();
  const { visual, delivery } = settings;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-colors">
      {/* Top micro bar with status and admin switch */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-white">
              <span className={`w-2 h-2 rounded-full ${storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {storeStatus.statusLabel}
            </span>
            <span className="hidden sm:inline-block text-neutral-500">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              Hoje: {storeStatus.todayScheduleText}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {visual.phone && (
              <a
                id="client-whatsapp-header-link"
                href={`https://wa.me/${visual.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                title="Falar no WhatsApp"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span className="hidden md:inline">Dúvidas? WhatsApp</span>
              </a>
            )}
            <button
              id="btn-goto-admin-header"
              onClick={onOpenAdmin}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Acesso Lojista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Logo */}
          <div 
            className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-sm border border-neutral-200/80 bg-neutral-100 flex-shrink-0 flex items-center justify-center"
            style={{ borderColor: visual.primaryColor ? `${visual.primaryColor}33` : undefined }}
          >
            {visual.logoUrl ? (
              <img
                src={visual.logoUrl}
                alt={visual.restaurantName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-2xl font-bold text-neutral-700">
                {visual.restaurantName.slice(0, 1)}
              </span>
            )}
          </div>

          {/* Restaurant Details */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              {visual.restaurantName}
            </h1>
            {visual.slogan && (
              <p className="text-xs sm:text-sm text-neutral-500 line-clamp-1">
                {visual.slogan}
              </p>
            )}
            <div className="flex items-center gap-2.5 mt-1 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {delivery.estimatedTimeMin}-{delivery.estimatedTimeMax} min
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                Delivery disponível
              </span>
            </div>
          </div>
        </div>

        {/* Cart Button */}
        <button
          id="btn-open-cart"
          onClick={onOpenCart}
          className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95 text-white"
          style={{ backgroundColor: visual.primaryColor || '#E11D48' }}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-neutral-900 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <div className="hidden sm:flex flex-col items-start text-left text-xs leading-none">
            <span className="opacity-90 font-medium">Sacola</span>
            <span className="text-sm font-bold mt-0.5">
              {cartSubtotal > 0 ? formatCurrency(cartSubtotal) : 'Vazia'}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
