import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Send, 
  AlertCircle, 
  User, 
  Phone, 
  CheckCircle2, 
  Copy, 
  Check 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { PaymentMethod, Order } from '../../types/restaurant';
import { formatCurrency, generateRestaurantWhatsAppLink } from '../../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order, whatsappUrl: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    selectedNeighborhood,
    clearCart,
    createOrder,
    settings,
    storeStatus,
  } = useRestaurant();

  const primaryColor = settings.visual.primaryColor || '#E11D48';

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState(selectedNeighborhood === 'Outro' ? '' : selectedNeighborhood);
  const [complement, setComplement] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cashChangeFor, setCashChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!customerName.trim()) errs.customerName = 'Informe seu nome completo';
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      errs.customerPhone = 'Informe um WhatsApp válido com DDD';
    }
    if (!street.trim()) errs.street = 'Informe a rua / avenida';
    if (!number.trim()) errs.number = 'Informe o número da casa/prédio';
    if (!neighborhood.trim()) errs.neighborhood = 'Informe o bairro';

    if (paymentMethod === 'cash' && cashChangeFor) {
      const changeNum = parseFloat(cashChangeFor.replace(',', '.'));
      if (isNaN(changeNum) || changeNum < cartTotal) {
        errs.cashChangeFor = `O troco deve ser maior que o total (${formatCurrency(cartTotal)})`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCopyPix = () => {
    if (settings.pixKey) {
      navigator.clipboard.writeText(settings.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeStatus.isOpen) {
      alert('O restaurante está fechado para pedidos no momento.');
      return;
    }

    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const orderId = `PED-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: {
          street: street.trim(),
          number: number.trim(),
          neighborhood: neighborhood.trim(),
          complement: complement.trim() || undefined,
        },
        paymentMethod,
        cashChangeFor: paymentMethod === 'cash' && cashChangeFor ? parseFloat(cashChangeFor.replace(',', '.')) : undefined,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          notes: item.notes,
        })),
        subtotal: cartSubtotal,
        deliveryFee: deliveryFee,
        total: cartTotal,
        status: 'recebido',
        createdAt: Date.now(),
        notes: notes.trim() || undefined,
      };

      // 1. Save in Firestore & Local real-time sync
      await createOrder(newOrder);

      // 2. Build WhatsApp Link
      const waUrl = generateRestaurantWhatsAppLink(
        newOrder, 
        settings.visual.phone || '5511999998888', 
        settings.visual.restaurantName
      );

      // 3. Clear cart & trigger success modal
      clearCart();
      setIsSubmitting(false);
      onOrderSuccess(newOrder, waUrl);
    } catch (err) {
      console.error('Error submitting order:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="checkout-modal"
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-100 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 flex items-center gap-2">
              <span>Finalizar Pedido</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Preencha os dados de entrega e selecione a forma de pagamento
            </p>
          </div>
          <button
            id="btn-close-checkout-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Closed Warning if triggered during checkout */}
        {!storeStatus.isOpen && (
          <div className="bg-amber-50 p-3.5 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Atenção: A loja está fechada. Você não poderá concluir este pedido.</span>
          </div>
        )}

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Section: Customer Info */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              1. Seus Dados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Seu Nome *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className={`w-full p-2.5 text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.customerName ? 'border-rose-500 focus:ring-rose-200' : 'border-neutral-200 focus:ring-neutral-400/20'
                  }`}
                />
                {errors.customerName && (
                  <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.customerName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className={`w-full p-2.5 text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.customerPhone ? 'border-rose-500 focus:ring-rose-200' : 'border-neutral-200 focus:ring-neutral-400/20'
                  }`}
                />
                {errors.customerPhone && (
                  <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.customerPhone}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              2. Endereço de Entrega
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Rua / Avenida *
                  </label>
                  <input
                    id="checkout-street"
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Rua das Flores"
                    className={`w-full p-2.5 text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.street ? 'border-rose-500 focus:ring-rose-200' : 'border-neutral-200 focus:ring-neutral-400/20'
                    }`}
                  />
                  {errors.street && (
                    <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.street}</span>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Número *
                  </label>
                  <input
                    id="checkout-number"
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Ex: 123"
                    className={`w-full p-2.5 text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.number ? 'border-rose-500 focus:ring-rose-200' : 'border-neutral-200 focus:ring-neutral-400/20'
                    }`}
                  />
                  {errors.number && (
                    <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.number}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    id="checkout-neighborhood"
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Centro"
                    className={`w-full p-2.5 text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.neighborhood ? 'border-rose-500 focus:ring-rose-200' : 'border-neutral-200 focus:ring-neutral-400/20'
                    }`}
                  />
                  {errors.neighborhood && (
                    <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.neighborhood}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Complemento (opcional)
                  </label>
                  <input
                    id="checkout-complement"
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Ex: Apto 32, Bloco B"
                    className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Payment Method */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              3. Forma de Pagamento
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Credit Card */}
              <button
                type="button"
                id="pay-method-credit"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold leading-tight">Cartão de Crédito</span>
              </button>

              {/* Debit Card */}
              <button
                type="button"
                id="pay-method-debit"
                onClick={() => setPaymentMethod('debit_card')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'debit_card'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold leading-tight">Cartão de Débito</span>
              </button>

              {/* Pix */}
              <button
                type="button"
                id="pay-method-pix"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold leading-tight">Pix</span>
              </button>

              {/* Cash */}
              <button
                type="button"
                id="pay-method-cash"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold leading-tight">Dinheiro</span>
              </button>
            </div>

            {/* Payment Sub-options */}
            {paymentMethod === 'pix' && (
              <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Pagamento Instantâneo via Pix
                  </span>
                  {settings.pixKey && (
                    <button
                      type="button"
                      id="btn-copy-pix-key"
                      onClick={handleCopyPix}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
                    </button>
                  )}
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Chave Pix do restaurante: <strong className="font-mono">{settings.pixKey || 'contato@restaurante.com'}</strong>.
                  Ao enviar o pedido no WhatsApp, envie também o comprovante da transferência!
                </p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="mt-3 p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2">
                <label className="block text-xs font-semibold text-neutral-700">
                  Precisa de troco para quanto? (opcional)
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500 font-bold text-xs">
                    R$
                  </span>
                  <input
                    id="input-cash-change"
                    type="text"
                    value={cashChangeFor}
                    onChange={(e) => setCashChangeFor(e.target.value)}
                    placeholder={`Ex: ${(cartTotal + 20).toFixed(2)}`}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                  />
                </div>
                {errors.cashChangeFor && (
                  <span className="text-[11px] text-rose-500 block">{errors.cashChangeFor}</span>
                )}
              </div>
            )}
          </div>

          {/* Section: Additional instructions */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Instruções para o entregador / restaurante (opcional)
            </label>
            <input
              id="checkout-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Tocar interfone 402, deixar na portaria..."
              className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
            />
          </div>

          {/* Order Summary Recap */}
          <div className="p-3.5 bg-neutral-100/70 rounded-2xl space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>{cart.reduce((s, i) => s + i.quantity, 0)} itens no pedido</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Entrega</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="pt-1.5 border-t border-neutral-200 flex justify-between font-extrabold text-sm text-neutral-900">
              <span>Total a pagar</span>
              <span className="text-base" style={{ color: primaryColor }}>
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-confirm-order-submit"
              disabled={isSubmitting || !storeStatus.isOpen}
              className="w-full py-4 px-5 rounded-2xl text-white font-extrabold text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Processando...' : 'Confirmar e Enviar Pedido no WhatsApp'}</span>
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-2">
              Ao clicar, seu pedido é salvo no sistema em tempo real e encaminhado diretamente para o WhatsApp do restaurante.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
