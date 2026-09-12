import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    selectedNeighborhood,
    setSelectedNeighborhood,
    settings,
    storeStatus,
  } = useRestaurant();

  const primaryColor = settings.visual.primaryColor || '#E11D48';
  const neighborhoods = settings.delivery.neighborhoods || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              <h2 className="text-lg font-extrabold text-neutral-900">Sua Sacola</h2>
              {cart.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  id="btn-clear-cart"
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1"
                >
                  Esvaziar
                </button>
              )}
              <button
                id="btn-close-cart-drawer"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body / Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-neutral-800 text-lg">Sua sacola está vazia</h3>
                <p className="text-sm text-neutral-500 max-w-xs">
                  Adicione deliciosos lanches, porções ou bebidas do nosso cardápio para começar!
                </p>
                <button
                  id="btn-cart-start-shopping"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-xs transition-transform active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70"
                    >
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                          Sem foto
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-sm text-neutral-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            id={`btn-remove-item-${item.product.id}`}
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-neutral-500 italic mt-0.5 line-clamp-1">
                            Obs: {item.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-extrabold text-sm text-neutral-900">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>

                          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-1 shadow-xs">
                            <button
                              id={`btn-cart-qty-minus-${item.product.id}`}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              id={`btn-cart-qty-plus-${item.product.id}`}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Neighborhood & Delivery Fee Calculator */}
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      Calcular Entrega por Bairro:
                    </span>
                    <span className="text-neutral-900 font-extrabold">
                      {formatCurrency(deliveryFee)}
                    </span>
                  </div>

                  <select
                    id="select-cart-neighborhood"
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  >
                    {neighborhoods.map((n) => (
                      <option key={n.id} value={n.name}>
                        {n.name} ({formatCurrency(n.fee)})
                      </option>
                    ))}
                    <option value="Outro">
                      Outro bairro não listado ({formatCurrency(settings.delivery.defaultFee)} - Taxa Padrão)
                    </option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Taxa de Entrega ({selectedNeighborhood})</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-extrabold text-base text-neutral-900">
                  <span>Total</span>
                  <span style={{ color: primaryColor }}>{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              {storeStatus.isOpen ? (
                <button
                  id="btn-proceed-to-checkout"
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>Avançar para Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Loja fechada no momento. Pedidos temporariamente indisponíveis.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
