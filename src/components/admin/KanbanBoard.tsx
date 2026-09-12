import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  MessageCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Search, 
  ChefHat, 
  Bike, 
  Inbox, 
  CheckCheck,
  Receipt,
  User
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Order, OrderStatus } from '../../types/restaurant';
import { formatCurrency, getPaymentMethodLabel, generateCustomerWhatsAppLink } from '../../utils/whatsapp';

const COLUMNS: { id: OrderStatus; title: string; icon: any; color: string; bgBadge: string }[] = [
  { id: 'recebido', title: 'Recebido', icon: Inbox, color: 'text-amber-500 border-amber-400', bgBadge: 'bg-amber-100 text-amber-900' },
  { id: 'em_preparo', title: 'Em Preparo', icon: ChefHat, color: 'text-blue-500 border-blue-400', bgBadge: 'bg-blue-100 text-blue-900' },
  { id: 'saiu_entrega', title: 'Saiu para Entrega', icon: Bike, color: 'text-purple-500 border-purple-400', bgBadge: 'bg-purple-100 text-purple-900' },
  { id: 'finalizado', title: 'Finalizado', icon: CheckCheck, color: 'text-emerald-500 border-emerald-400', bgBadge: 'bg-emerald-100 text-emerald-900' },
];

export const KanbanBoard: React.FC = () => {
  const { orders, updateOrderStatus, settings } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(term) ||
      order.id.toLowerCase().includes(term) ||
      order.address.neighborhood.toLowerCase().includes(term) ||
      order.customerPhone.includes(term)
    );
  });

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'recebido': return 'em_preparo';
      case 'em_preparo': return 'saiu_entrega';
      case 'saiu_entrega': return 'finalizado';
      default: return null;
    }
  };

  const getPrevStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'finalizado': return 'saiu_entrega';
      case 'saiu_entrega': return 'em_preparo';
      case 'em_preparo': return 'recebido';
      default: return null;
    }
  };

  const formatElapsed = (timestamp: number) => {
    const diffMin = Math.max(1, Math.floor((Date.now() - timestamp) / (1000 * 60)));
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    return `há ${diffHours}h ${diffMin % 60}m`;
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Search & Total counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
            <span>Gestão de Pedidos (Kanban)</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
              {orders.length} pedidos
            </span>
          </h2>
          <p className="text-xs text-neutral-500">
            Acompanhe e movimente os pedidos em tempo real por ordem de chegada
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-kanban-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, pedido ou bairro..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
          />
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colOrders = filteredOrders
            .filter(o => o.status === col.id)
            .sort((a, b) => b.createdAt - a.createdAt);

          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              id={`kanban-column-${col.id}`}
              className="bg-neutral-100/70 rounded-3xl p-3 border border-neutral-200/80 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="p-2.5 mb-2 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${col.bgBadge}`}>
                    <ColIcon className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-sm text-neutral-900">{col.title}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bgBadge}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colOrders.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                    <p className="text-xs">Nenhum pedido nesta etapa</p>
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const next = getNextStatus(order.status);
                    const prev = getPrevStatus(order.status);
                    const waLink = generateCustomerWhatsAppLink(order, settings.visual.restaurantName);

                    return (
                      <div
                        key={order.id}
                        id={`order-card-${order.id}`}
                        className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
                      >
                        {/* Card Header: ID & Time */}
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <span className="font-extrabold text-sm text-neutral-900">
                            #{order.id}
                          </span>
                          <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {formatElapsed(order.createdAt)}
                          </span>
                        </div>

                        {/* Customer & Address */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-neutral-400" />
                              {order.customerName}
                            </h4>
                          </div>

                          <div className="text-xs text-neutral-600 flex items-start gap-1.5 mt-1 bg-neutral-50 p-2 rounded-xl border border-neutral-150">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                            <div className="leading-snug">
                              <p className="font-medium text-neutral-800">
                                {order.address.street}, {order.address.number}
                              </p>
                              <p className="text-neutral-500 text-[11px]">
                                Bairro: <strong>{order.address.neighborhood}</strong>
                                {order.address.complement ? ` • ${order.address.complement}` : ''}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-neutral-50/70 p-2.5 rounded-xl border border-neutral-100 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Itens ({order.items.reduce((s, i) => s + i.quantity, 0)}):
                          </span>
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-start text-neutral-700">
                              <span className="font-medium">
                                <strong className="text-neutral-900">{item.quantity}x</strong> {item.name}
                                {item.notes && <span className="text-neutral-500 italic block text-[11px] pl-4">↳ {item.notes}</span>}
                              </span>
                              <span className="font-semibold text-neutral-900 whitespace-nowrap ml-2">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Payment & Total */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-semibold text-[11px]">
                              {getPaymentMethodLabel(order.paymentMethod)}
                            </span>
                            {order.cashChangeFor && (
                              <span className="block text-[10px] text-neutral-500 mt-0.5">
                                Troco p/ {formatCurrency(order.cashChangeFor)}
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-neutral-400 block">Total</span>
                            <span className="text-sm font-extrabold text-neutral-900">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* WhatsApp Action Button (Required in prompt) */}
                        <div className="pt-2 border-t border-neutral-100">
                          <a
                            id={`btn-whatsapp-order-${order.id}`}
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            title="Conversar com o cliente no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp do Cliente ({order.customerPhone})</span>
                          </a>
                        </div>

                        {/* Move Between Stages Buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          {prev && (
                            <button
                              id={`btn-move-prev-${order.id}`}
                              onClick={() => updateOrderStatus(order.id, prev)}
                              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center justify-center transition-colors"
                              title="Voltar etapa anterior"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {next ? (
                            <button
                              id={`btn-move-next-${order.id}`}
                              onClick={() => updateOrderStatus(order.id, next)}
                              className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <span>
                                {next === 'em_preparo' && 'Iniciar Preparo'}
                                {next === 'saiu_entrega' && 'Despachar Entrega'}
                                {next === 'finalizado' && 'Concluir Pedido'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="flex-1 py-1.5 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                              ✓ Pedido Entregue
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
