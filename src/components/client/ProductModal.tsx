import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/restaurant';
import { formatCurrency } from '../../utils/whatsapp';
import { useRestaurant } from '../../context/RestaurantContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isStoreOpen: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, isStoreOpen }) => {
  const { addToCart, settings } = useRestaurant();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  if (!product) return null;

  const total = product.price * quantity;

  const handleAdd = () => {
    addToCart(product, quantity, notes.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="product-detail-modal"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-100 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header / Image */}
        <div className="relative h-56 sm:h-64 bg-neutral-100 flex-shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 font-medium">
              Sem Imagem
            </div>
          )}
          <button
            id="btn-close-product-modal"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 bg-neutral-900/70 hover:bg-neutral-900 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                {product.name}
              </h2>
              <span className="text-lg sm:text-xl font-bold text-neutral-900 whitespace-nowrap">
                {formatCurrency(product.price)}
              </span>
            </div>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Observations / Notes */}
          <div className="pt-3 border-t border-neutral-100">
            <label htmlFor="product-notes" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Alguma observação? (opcional)
            </label>
            <textarea
              id="product-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem cebola, maionese à parte, ponto da carne..."
              className="w-full p-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/20 focus:border-neutral-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200/80 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl p-1.5 shadow-xs">
            <button
              id="btn-modal-qty-decrease"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-neutral-900 w-5 text-center">
              {quantity}
            </span>
            <button
              id="btn-modal-qty-increase"
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button or Closed Notification */}
          {isStoreOpen ? (
            <button
              id="btn-modal-add-to-cart"
              onClick={handleAdd}
              className="flex-1 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-sm transition-all active:scale-98 flex items-center justify-between"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Adicionar à Sacola
              </span>
              <span>{formatCurrency(total)}</span>
            </button>
          ) : (
            <div className="flex-1 text-center py-2 px-3 bg-amber-100 text-amber-900 text-xs font-semibold rounded-xl">
              Loja Fechada: pedidos bloqueados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
