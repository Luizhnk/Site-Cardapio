import React from 'react';
import { CheckCircle2, MessageCircle, ArrowLeft, Clock, MapPin, ReceiptText } from 'lucide-react';
import { Order } from '../../types/restaurant';
import { formatCurrency, getPaymentMethodLabel } from '../../utils/whatsapp';
import { useRestaurant } from '../../context/RestaurantContext';

interface OrderSuccessModalProps {
  order: Order | null;
  whatsappUrl: string;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, whatsappUrl, onClose }) => {
  const { settings } = useRestaurant();
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="order-success-modal"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-100 p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200"
      >
        {/* Animated Check Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 mb-2">
          Pedido Confirmado com Sucesso!
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
          Pedido #{order.id}
        </h2>

        <p className="text-sm text-neutral-600 mt-2 max-w-sm mx-auto leading-relaxed">
          Obrigado, <strong>{order.customerName}</strong>! Seu pedido já está registrado em nosso sistema e aguarda início do preparo.
        </p>

        {/* WhatsApp Direct Action Button */}
        <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-emerald-950">Enviar no WhatsApp</h4>
              <p className="text-xs text-emerald-800/90 mt-0.5">
                Se a janela do WhatsApp não abriu automaticamente, clique no botão abaixo para enviar os detalhes do pedido:
              </p>
            </div>
          </div>

          <a
            id="btn-whatsapp-redirect-success"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Abrir WhatsApp do Restaurante</span>
          </a>
        </div>

        {/* Quick Summary Card */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-left text-xs space-y-2 mb-6">
          <div className="flex items-center justify-between font-bold text-neutral-800 pb-2 border-b border-neutral-200">
            <span className="flex items-center gap-1.5">
              <ReceiptText className="w-4 h-4 text-neutral-500" />
              Resumo do Pedido
            </span>
            <span className="text-sm" style={{ color: primaryColor }}>
              {formatCurrency(order.total)}
            </span>
          </div>

          <div className="space-y-1 text-neutral-600">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-200 space-y-1">
            <div className="flex items-center gap-1 text-neutral-600">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{order.address.street}, {order.address.number} - {order.address.neighborhood}</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-600">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Pagamento: {getPaymentMethodLabel(order.paymentMethod)}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          id="btn-close-order-success"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Cardápio</span>
        </button>
      </div>
    </div>
  );
};
