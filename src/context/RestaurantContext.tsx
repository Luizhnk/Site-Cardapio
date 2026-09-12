import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RestaurantSettings, 
  Category, 
  Product, 
  Order, 
  OrderStatus, 
  NeighborhoodFee 
} from '../types/restaurant';
import { restaurantService } from '../services/restaurantService';
import { initialSettings, initialCategories, initialProducts, initialOrders } from '../data/initialData';
import { checkStoreOpenStatus, StoreStatusResult } from '../utils/operatingHours';

interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

interface RestaurantContextType {
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  storeStatus: StoreStatusResult;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (neighborhood: string) => void;
  deliveryFee: number;
  cartTotal: number;
  // Admin Operations
  updateSettings: (settings: RestaurantSettings) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveNeighborhood: (neighborhood: NeighborhoodFee) => Promise<void>;
  deleteNeighborhood: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  createOrder: (order: Order) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Centro');

  // Subscriptions
  useEffect(() => {
    const unsubSettings = restaurantService.subscribeSettings(setSettings);
    const unsubCategories = restaurantService.subscribeCategories(setCategories);
    const unsubProducts = restaurantService.subscribeProducts(setProducts);
    const unsubOrders = restaurantService.subscribeOrders(setOrders);

    return () => {
      unsubSettings();
      unsubCategories();
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // Compute Store Open/Closed Status
  const storeStatus = checkStoreOpenStatus(settings.operatingHours);

  // Delivery fee calculation
  const foundNeighborhood = settings.delivery.neighborhoods.find(
    n => n.name.toLowerCase() === selectedNeighborhood.toLowerCase()
  );
  const deliveryFee = foundNeighborhood ? foundNeighborhood.fee : settings.delivery.defaultFee;

  // Cart totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + deliveryFee : 0;

  // Cart actions
  const addToCart = (product: Product, quantity: number = 1, notes?: string) => {
    setCart(prev => {
      const index = prev.findIndex(item => item.product.id === product.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantity,
          notes: notes !== undefined ? notes : updated[index].notes,
        };
        return updated;
      }
      return [...prev, { product, quantity, notes }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Sync CSS variables with primary/secondary colors for seamless dynamic branding
  useEffect(() => {
    if (settings.visual.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.visual.primaryColor);
    }
    if (settings.visual.secondaryColor) {
      document.documentElement.style.setProperty('--secondary', settings.visual.secondaryColor);
    }
  }, [settings.visual.primaryColor, settings.visual.secondaryColor]);

  const value: RestaurantContextType = {
    settings,
    categories,
    products,
    orders,
    storeStatus,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    selectedNeighborhood,
    setSelectedNeighborhood,
    deliveryFee,
    cartTotal,
    updateSettings: (s) => restaurantService.updateSettings(s),
    saveCategory: (c) => restaurantService.saveCategory(c),
    deleteCategory: (id) => restaurantService.deleteCategory(id),
    saveProduct: (p) => restaurantService.saveProduct(p),
    deleteProduct: (id) => restaurantService.deleteProduct(id),
    saveNeighborhood: (n) => restaurantService.saveNeighborhood(n),
    deleteNeighborhood: (id) => restaurantService.deleteNeighborhood(id),
    updateOrderStatus: (id, status) => restaurantService.updateOrderStatus(id, status),
    createOrder: (o) => restaurantService.createOrder(o),
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
