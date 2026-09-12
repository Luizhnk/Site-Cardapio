export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';

export type OrderStatus = 'recebido' | 'em_preparo' | 'saiu_entrega' | 'finalizado' | 'cancelado';

export interface Category {
  id: string;
  name: string;
  order: number;
  icon?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
  featured?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderAddress {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  city?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: OrderAddress;
  paymentMethod: PaymentMethod;
  cashChangeFor?: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  notes?: string;
}

export interface NeighborhoodFee {
  id: string;
  name: string;
  fee: number;
}

export interface DaySchedule {
  enabled: boolean;
  start: string; // e.g. "18:00"
  end: string;   // e.g. "23:30"
}

export type StoreOperatingMode = 'auto' | 'forced_open' | 'forced_closed';

export interface OperatingHours {
  mode: StoreOperatingMode;
  days: {
    segunda: DaySchedule;
    terca: DaySchedule;
    quarta: DaySchedule;
    quinta: DaySchedule;
    sexta: DaySchedule;
    sabado: DaySchedule;
    domingo: DaySchedule;
  };
}

export interface VisualIdentity {
  restaurantName: string;
  logoUrl: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  phone: string; // WhatsApp number digits only (e.g. 5511999999999)
  slogan?: string;
  addressSummary?: string;
}

export interface DeliverySettings {
  defaultFee: number;
  neighborhoods: NeighborhoodFee[];
  estimatedTimeMin: number;
  estimatedTimeMax: number;
}

export interface RestaurantSettings {
  visual: VisualIdentity;
  operatingHours: OperatingHours;
  delivery: DeliverySettings;
  pixKey?: string;
}
