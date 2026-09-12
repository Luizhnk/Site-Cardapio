import React from 'react';
import { Plus, Eye } from 'lucide-react';
import { Product } from '../../types/restaurant';
import { formatCurrency } from '../../utils/whatsapp';
import { useRestaurant } from '../../context/RestaurantContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isStoreOpen: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAdd,
  isStoreOpen,
}) => {
  const { settings } = useRestaurant();
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all duration-200 group relative"
    >
      <div>
        {/* Image Container */}
        <div 
          onClick={() => onSelectProduct(product)}
          className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-neutral-100 cursor-pointer mb-3.5 group-hover:scale-[1.01] transition-transform"
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 font-medium">
              Sem Imagem
            </div>
          )}

          {product.featured && (
            <span 
              className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              Destaque
            </span>
          )}

          <button 
            id={`btn-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="absolute bottom-2.5 right-2.5 bg-neutral-900/80 hover:bg-neutral-900 text-white p-2 rounded-lg backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
          <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-neutral-400 block font-medium">A partir de</span>
          <span className="text-base sm:text-lg font-extrabold text-neutral-900">
            {formatCurrency(product.price)}
          </span>
        </div>

        {isStoreOpen ? (
          <button
            id={`btn-add-product-${product.id}`}
            onClick={() => onQuickAdd(product)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 hover:opacity-95 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        ) : (
          <button
            id={`btn-view-closed-${product.id}`}
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-medium hover:bg-neutral-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver prato</span>
          </button>
        )}
      </div>
    </div>
  );
};
