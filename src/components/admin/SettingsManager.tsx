import React, { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Check, 
  AlertTriangle, 
  QrCode, 
  Calendar, 
  Timer 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OperatingHours, StoreOperatingMode } from '../../types/restaurant';

const DAYS_LIST: { key: keyof OperatingHours['days']; label: string }[] = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca', label: 'Terça-feira' },
  { key: 'quarta', label: 'Quarta-feira' },
  { key: 'quinta', label: 'Quinta-feira' },
  { key: 'sexta', label: 'Sexta-feira' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

export const SettingsManager: React.FC = () => {
  const { settings, updateSettings } = useRestaurant();
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  const [mode, setMode] = useState<StoreOperatingMode>(settings.operatingHours.mode);
  const [days, setDays] = useState(settings.operatingHours.days);
  const [minTime, setMinTime] = useState(settings.delivery.estimatedTimeMin.toString());
  const [maxTime, setMaxTime] = useState(settings.delivery.estimatedTimeMax.toString());
  const [pixKey, setPixKey] = useState(settings.pixKey || '');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDayToggle = (dayKey: keyof OperatingHours['days']) => {
    setDays(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
      }
    }));
  };

  const handleTimeChange = (dayKey: keyof OperatingHours['days'], field: 'start' | 'end', val: string) => {
    setDays(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: val,
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateSettings({
      ...settings,
      operatingHours: {
        mode,
        days,
      },
      delivery: {
        ...settings.delivery,
        estimatedTimeMin: parseInt(minTime) || 30,
        estimatedTimeMax: parseInt(maxTime) || 50,
      },
      pixKey: pixKey.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h2 className="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-neutral-700" />
          <span>Configurações & Horários de Atendimento</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Defina o expediente por dia da semana, tempo estimado de entrega e bloqueio automático de pedidos fora do horário.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Status Mode Selection */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            Modo de Funcionamento da Loja
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              id="mode-btn-auto"
              onClick={() => setMode('auto')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                mode === 'auto'
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <span className="font-extrabold text-xs flex items-center gap-1.5">
                <span>⚡</span> Automático (Recomendado)
              </span>
              <span className="text-[11px] opacity-80 mt-1">
                Abre e fecha sozinho de acordo com os horários programados abaixo.
              </span>
            </button>

            <button
              type="button"
              id="mode-btn-forced-open"
              onClick={() => setMode('forced_open')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                mode === 'forced_open'
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <span className="font-extrabold text-xs flex items-center gap-1.5">
                <span>🟢</span> Forçar Aberto
              </span>
              <span className="text-[11px] opacity-80 mt-1">
                Mantém a loja aceitando pedidos agora, ignorando os horários cadastrados.
              </span>
            </button>

            <button
              type="button"
              id="mode-btn-forced-closed"
              onClick={() => setMode('forced_closed')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                mode === 'forced_closed'
                  ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <span className="font-extrabold text-xs flex items-center gap-1.5">
                <span>🔴</span> Forçar Fechado
              </span>
              <span className="text-[11px] opacity-80 mt-1">
                Bloqueia novos pedidos imediatamente (cardápio continua visível aos clientes).
              </span>
            </button>
          </div>
        </div>

        {/* Operating Hours per Day */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              Expediente por Dia da Semana
            </h3>
            <span className="text-xs text-neutral-400">
              Fora destes horários os pedidos são desabilitados automaticamente
            </span>
          </div>

          <div className="border border-neutral-200/80 rounded-2xl overflow-hidden divide-y divide-neutral-200/60">
            {DAYS_LIST.map(({ key, label }) => {
              const day = days[key];

              return (
                <div 
                  key={key}
                  id={`schedule-row-${key}`}
                  className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`checkbox-day-${key}`}
                      checked={day.enabled}
                      onChange={() => handleDayToggle(key)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <label htmlFor={`checkbox-day-${key}`} className="font-bold text-neutral-900 cursor-pointer text-sm">
                      {label}
                    </label>
                  </div>

                  {day.enabled ? (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-neutral-500 text-[11px]">Das</span>
                      <input
                        type="time"
                        id={`time-start-${key}`}
                        value={day.start}
                        onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                        className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold"
                      />
                      <span className="text-neutral-500 text-[11px]">às</span>
                      <input
                        type="time"
                        id={`time-end-${key}`}
                        value={day.end}
                        onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                        className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold"
                      />
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic text-[11px] self-end sm:self-auto">
                      Não atende neste dia
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* General Delivery Time & Pix key */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Estimated Delivery Time */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Timer className="w-4 h-4 text-neutral-500" />
              Tempo Médio Estimado de Entrega
            </h3>
            <p className="text-xs text-neutral-500">
              Exibido no topo do app do cliente (ex: 35-50 min).
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Tempo Mínimo (minutos)
                </label>
                <input
                  id="input-delivery-min-time"
                  type="number"
                  min="5"
                  value={minTime}
                  onChange={(e) => setMinTime(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Tempo Máximo (minutos)
                </label>
                <input
                  id="input-delivery-max-time"
                  type="number"
                  min="10"
                  value={maxTime}
                  onChange={(e) => setMaxTime(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Pix Key Config */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-neutral-500" />
              Chave Pix do Restaurante
            </h3>
            <p className="text-xs text-neutral-500">
              Exibida com botão de cópia rápida no checkout quando o cliente escolhe Pix.
            </p>

            <div className="text-xs">
              <label className="block font-semibold text-neutral-700 mb-1">
                Chave Pix (CNPJ, CPF, Email, Telefone ou Aleatória)
              </label>
              <input
                id="input-pix-key"
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Ex: financeiro@meurestaurante.com ou 11999998888"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            id="btn-save-settings"
            className="py-3 px-6 rounded-xl text-white font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Check className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>

          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold animate-in fade-in">
              ✓ Configurações e horários salvos com sucesso!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
