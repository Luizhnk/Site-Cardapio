import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ClientHeader } from './ClientHeader';
import { StoreClosedBanner } from './StoreClosedBanner';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { Product, Order } from '../../types/restaurant';
import { ShoppingBag, Utensils, Sparkles } from 'lucide-react';

interface ClientAppProps {
  onOpenAdmin: () => void;
}

export const ClientApp: React.FC<ClientAppProps> = ({ onOpenAdmin }) => {
  const { categories, products, storeStatus, settings, cartCount } = useRestaurant();
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  // Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ order: Order; waUrl: string } | null>(null);

  // Filtered products
  const filteredProducts = products.filter(product => {
    // Category match
    const matchesCategory = selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;
    // Search match
    const matchesSearch = !searchQuery.trim() || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOrderSuccess = (order: Order, whatsappUrl: string) => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCompletedOrder({ order, waUrl: whatsappUrl });

    // Automatically trigger WhatsApp in new tab/window
    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      // Fallback handled inside OrderSuccessModal
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 flex flex-col">
      {/* Header */}
      <ClientHeader 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Store Closed Banner (Conditional) */}
      <StoreClosedBanner status={storeStatus} />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Category Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-neutral-600" />
                <span>Nosso Cardápio</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Escolha seus itens favoritos e receba no conforto da sua casa
              </p>
            </div>
            {settings.visual.addressSummary && (
              <span className="text-xs text-neutral-400">
                {settings.visual.addressSummary}
              </span>
            )}
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-800">Nenhum produto encontrado</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
              Não encontramos nenhum item com esses filtros. Tente buscar por outro termo ou categoria.
            </p>
            <button
              id="btn-reset-filters"
              onClick={() => {
                setSelectedCategoryId('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={setSelectedProduct}
                onQuickAdd={handleQuickAdd}
                isStoreOpen={storeStatus.isOpen}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar for Mobile */}
      {cartCount > 0 && (
        <div className="sm:hidden fixed bottom-4 inset-x-4 z-40">
          <button
            id="btn-mobile-floating-cart"
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl text-white font-extrabold shadow-xl flex items-center justify-between active:scale-98 transition-transform"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-black/20 rounded-lg p-1.5">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">Ver Sacola ({cartCount})</span>
            </div>
            <span className="text-sm font-extrabold">Avançar →</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-neutral-200/80 py-8 px-4 text-center text-xs text-neutral-500 space-y-2">
        <p className="font-bold text-neutral-700 text-sm">{settings.visual.restaurantName}</p>
        <p>{settings.visual.slogan}</p>
        <p className="text-neutral-400">
          Pedidos enviados diretamente para o WhatsApp • Atualização em tempo real
        </p>
      </footer>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isStoreOpen={storeStatus.isOpen}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Confirmation Modal */}
      <OrderSuccessModal
        order={completedOrder?.order || null}
        whatsappUrl={completedOrder?.waUrl || ''}
        onClose={() => setCompletedOrder(null)}
      />
    </div>
  );
};
