import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Order, 
  Category, 
  Product, 
  RestaurantSettings, 
  OrderStatus, 
  NeighborhoodFee 
} from '../types/restaurant';
import { 
  initialSettings, 
  initialCategories, 
  initialProducts, 
  initialOrders 
} from '../data/initialData';

// Local storage keys
const STORAGE_SETTINGS = 'bassa_restaurant_settings';
const STORAGE_CATEGORIES = 'bassa_restaurant_categories';
const STORAGE_PRODUCTS = 'bassa_restaurant_products';
const STORAGE_ORDERS = 'bassa_restaurant_orders';

// Helper to get from local storage or fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

export const restaurantService = {
  // --- SETTINGS ---
  subscribeSettings(callback: (settings: RestaurantSettings) => void): () => void {
    const initial = getLocal<RestaurantSettings>(STORAGE_SETTINGS, initialSettings);
    callback(initial);

    if (!db) return () => {};

    try {
      const docRef = doc(db, 'settings', 'general');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as RestaurantSettings;
          setLocal(STORAGE_SETTINGS, data);
          callback(data);
        } else {
          // Initialize remote if empty
          setDoc(docRef, initial).catch(() => {});
        }
      }, (error) => {
        console.warn('Firestore settings listener fallback to local storage:', error.message);
      });
      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  async updateSettings(settings: RestaurantSettings): Promise<void> {
    setLocal(STORAGE_SETTINGS, settings);
    if (!db) return;
    try {
      const docRef = doc(db, 'settings', 'general');
      await setDoc(docRef, settings, { merge: true });
    } catch (err) {
      console.warn('Could not sync settings to Firestore, saved locally:', err);
    }
  },

  // --- CATEGORIES ---
  subscribeCategories(callback: (categories: Category[]) => void): () => void {
    const local = getLocal<Category[]>(STORAGE_CATEGORIES, initialCategories);
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'categories');
      const q = query(colRef, orderBy('order', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const cats = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
          setLocal(STORAGE_CATEGORIES, cats);
          callback(cats);
        } else {
          // seed remote with initial categories
          local.forEach(c => setDoc(doc(db, 'categories', c.id), c).catch(() => {}));
        }
      }, (error) => {
        console.warn('Firestore categories listener fallback to local:', error.message);
      });
      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  async saveCategory(category: Category): Promise<void> {
    const local = getLocal<Category[]>(STORAGE_CATEGORIES, initialCategories);
    const existingIndex = local.findIndex(c => c.id === category.id);
    let updated: Category[];
    if (existingIndex >= 0) {
      updated = [...local];
      updated[existingIndex] = category;
    } else {
      updated = [...local, category];
    }
    setLocal(STORAGE_CATEGORIES, updated);

    if (!db) return;
    try {
      await setDoc(doc(db, 'categories', category.id), category);
    } catch (err) {
      console.warn('Saved category locally:', err);
    }
  },

  async deleteCategory(categoryId: string): Promise<void> {
    const local = getLocal<Category[]>(STORAGE_CATEGORIES, initialCategories);
    const updated = local.filter(c => c.id !== categoryId);
    setLocal(STORAGE_CATEGORIES, updated);

    if (!db) return;
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (err) {
      console.warn('Deleted category locally:', err);
    }
  },

  // --- PRODUCTS ---
  subscribeProducts(callback: (products: Product[]) => void): () => void {
    const local = getLocal<Product[]>(STORAGE_PRODUCTS, initialProducts);
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'products');
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const prods = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
          setLocal(STORAGE_PRODUCTS, prods);
          callback(prods);
        } else {
          local.forEach(p => setDoc(doc(db, 'products', p.id), p).catch(() => {}));
        }
      }, (error) => {
        console.warn('Firestore products listener fallback to local:', error.message);
      });
      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  async saveProduct(product: Product): Promise<void> {
    const local = getLocal<Product[]>(STORAGE_PRODUCTS, initialProducts);
    const index = local.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...local];
      updated[index] = product;
    } else {
      updated = [product, ...local];
    }
    setLocal(STORAGE_PRODUCTS, updated);

    if (!db) return;
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (err) {
      console.warn('Saved product locally:', err);
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    const local = getLocal<Product[]>(STORAGE_PRODUCTS, initialProducts);
    const updated = local.filter(p => p.id !== productId);
    setLocal(STORAGE_PRODUCTS, updated);

    if (!db) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Deleted product locally:', err);
    }
  },

  // --- ORDERS (Kanban & Real-time) ---
  subscribeOrders(callback: (orders: Order[]) => void): () => void {
    const local = getLocal<Order[]>(STORAGE_ORDERS, initialOrders);
    callback(local);

    if (!db) return () => {};

    try {
      const colRef = collection(db, 'orders');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
          setLocal(STORAGE_ORDERS, remoteOrders);
          callback(remoteOrders);
        }
      }, (error) => {
        console.warn('Firestore orders listener fallback to local:', error.message);
      });
      return unsubscribe;
    } catch {
      return () => {};
    }
  },

  async createOrder(order: Order): Promise<void> {
    const local = getLocal<Order[]>(STORAGE_ORDERS, initialOrders);
    const updated = [order, ...local];
    setLocal(STORAGE_ORDERS, updated);

    if (!db) return;
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (err) {
      console.warn('Saved order locally:', err);
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const local = getLocal<Order[]>(STORAGE_ORDERS, initialOrders);
    const updated = local.map(o => o.id === orderId ? { ...o, status } : o);
    setLocal(STORAGE_ORDERS, updated);

    if (!db) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      console.warn('Updated order status locally:', err);
    }
  },

  // --- NEIGHBORHOODS ---
  async saveNeighborhood(neighborhood: NeighborhoodFee): Promise<void> {
    const settings = getLocal<RestaurantSettings>(STORAGE_SETTINGS, initialSettings);
    const list = settings.delivery.neighborhoods || [];
    const index = list.findIndex(n => n.id === neighborhood.id);
    let updatedList: NeighborhoodFee[];
    if (index >= 0) {
      updatedList = [...list];
      updatedList[index] = neighborhood;
    } else {
      updatedList = [...list, neighborhood];
    }
    const newSettings: RestaurantSettings = {
      ...settings,
      delivery: {
        ...settings.delivery,
        neighborhoods: updatedList,
      }
    };
    await this.updateSettings(newSettings);
  },

  async deleteNeighborhood(id: string): Promise<void> {
    const settings = getLocal<RestaurantSettings>(STORAGE_SETTINGS, initialSettings);
    const updatedList = (settings.delivery.neighborhoods || []).filter(n => n.id !== id);
    const newSettings: RestaurantSettings = {
      ...settings,
      delivery: {
        ...settings.delivery,
        neighborhoods: updatedList,
      }
    };
    await this.updateSettings(newSettings);
  }
};
