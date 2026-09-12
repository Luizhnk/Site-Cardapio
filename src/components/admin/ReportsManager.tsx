import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Calendar, 
  Filter 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, PaymentMethod } from '../../types/restaurant';
import { formatCurrency, getPaymentMethodLabel } from '../../utils/whatsapp';

type PeriodFilter = 'today' | '7days' | '30days' | 'all';

export const ReportsManager: React.FC = () => {
  const { orders } = useRestaurant();
  const [period, setPeriod] = useState<PeriodFilter>('all');

  // Filter orders by period
  const now = Date.now();
  const filteredOrders = orders.filter((order) => {
    if (period === 'all') return true;

    const diffMs = now - order.createdAt;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (period === 'today') {
      const orderDate = new Date(order.createdAt).toDateString();
      const todayDate = new Date().toDateString();
      return orderDate === todayDate;
    }
    if (period === '7days') {
      return diffDays <= 7;
    }
    if (period === '30days') {
      return diffDays <= 30;
    }
    return true;
  });

  // Calculate Metrics
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const totalDeliveryFees = filteredOrders.reduce((sum, o) => sum + o.deliveryFee, 0);

  // Group by Payment Method
  const paymentMethodsList: { key: PaymentMethod; label: string; icon: any; color: string; barColor: string }[] = [
    { key: 'pix', label: 'Pix', icon: QrCode, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500' },
    { key: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-200', barColor: 'bg-blue-500' },
    { key: 'debit_card', label: 'Cartão de Débito', icon: CreditCard, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', barColor: 'bg-indigo-500' },
    { key: 'cash', label: 'Dinheiro', icon: Banknote, color: 'text-amber-600 bg-amber-50 border-amber-200', barColor: 'bg-amber-500' },
  ];

  const paymentBreakdown = paymentMethodsList.map((pm) => {
    const methodOrders = filteredOrders.filter(o => o.paymentMethod === pm.key);
    const amount = methodOrders.reduce((sum, o) => sum + o.total, 0);
    const count = methodOrders.length;
    const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
    return {
      ...pm,
      amount,
      count,
      percentage,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header & Period Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-neutral-700" />
            <span>Relatórios Financeiros & Vendas</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Métricas de faturamento, volume e divisão por formas de pagamento
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
          <button
            id="filter-period-today"
            onClick={() => setPeriod('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'today' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Hoje
          </button>
          <button
            id="filter-period-7days"
            onClick={() => setPeriod('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === '7days' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            id="filter-period-30days"
            onClick={() => setPeriod('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === '30days' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            30 dias
          </button>
          <button
            id="filter-period-all"
            onClick={() => setPeriod('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold">Faturamento Total</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {formatCurrency(totalRevenue)}
          </p>
          <span className="text-[11px] text-neutral-400 block">
            {totalOrdersCount} pedidos considerados
          </span>
        </div>

        {/* Order Count */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold">Total de Pedidos</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {totalOrdersCount}
          </p>
          <span className="text-[11px] text-neutral-400 block">
            No período selecionado
          </span>
        </div>

        {/* Average Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold">Ticket Médio</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {formatCurrency(averageTicket)}
          </p>
          <span className="text-[11px] text-neutral-400 block">
            Valor médio por cliente
          </span>
        </div>

        {/* Delivery Fees Collected */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span className="font-semibold">Taxas de Entrega</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {formatCurrency(totalDeliveryFees)}
          </p>
          <span className="text-[11px] text-neutral-400 block">
            Arrecadado com frete
          </span>
        </div>
      </div>

      {/* Payment Methods Breakdown (Requested in prompt) */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-neutral-900">
            Faturamento por Forma de Pagamento
          </h3>
          <p className="text-xs text-neutral-500">
            Distribuição dos pedidos entre Cartão de crédito, Cartão de débito, Pix e Dinheiro
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {paymentBreakdown.map((pm) => {
            const PmIcon = pm.icon;

            return (
              <div
                key={pm.key}
                id={`report-card-payment-${pm.key}`}
                className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${pm.color}`}>
                      <PmIcon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-neutral-800">{pm.label}</span>
                  </div>
                  <span className="text-xs font-bold text-neutral-500">
                    {pm.count} {pm.count === 1 ? 'ped' : 'peds'}
                  </span>
                </div>

                <div>
                  <span className="text-lg font-extrabold text-neutral-900 block">
                    {formatCurrency(pm.amount)}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {pm.percentage.toFixed(1)}% do total
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pm.barColor}`}
                    style={{ width: `${Math.max(2, pm.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders History Table */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-neutral-900">
          Histórico Detalhado de Pedidos ({filteredOrders.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Pedido</th>
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Bairro</th>
                <th className="py-2.5 px-3">Pagamento</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    Nenhum pedido encontrado neste período.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-neutral-900">#{order.id}</td>
                      <td className="py-3 px-3 text-neutral-500">{dateStr}</td>
                      <td className="py-3 px-3 font-semibold text-neutral-800">{order.customerName}</td>
                      <td className="py-3 px-3 text-neutral-600">{order.address.neighborhood}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          order.status === 'finalizado' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'saiu_entrega' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'em_preparo' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-neutral-900">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
