import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { StoreStatusResult } from '../../utils/operatingHours';

interface StoreClosedBannerProps {
  status: StoreStatusResult;
}

export const StoreClosedBanner: React.FC<StoreClosedBannerProps> = ({ status }) => {
  if (status.isOpen) return null;

  return (
    <div 
      id="store-closed-banner" 
      className="max-w-6xl mx-auto px-4 mt-4"
    >
      <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950 shadow-xs">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0 mt-0.5">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-amber-900 flex items-center gap-2">
            Restaurante Fechado no Momento
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
              Apenas Cardápio
            </span>
          </h2>
          <p className="text-sm text-amber-800/90 mt-1 leading-relaxed">
            {status.message} Você pode navegar à vontade por todos os pratos e preços do nosso cardápio, porém a finalização de novos pedidos está temporariamente bloqueada.
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-amber-900">
            <Clock className="w-3.5 h-3.5" />
            <span>Horário padrão de atendimento hoje: {status.todayScheduleText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
