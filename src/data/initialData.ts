import { Category, Product, RestaurantSettings, Order } from '../types/restaurant';

export const initialSettings: RestaurantSettings = {
  visual: {
    restaurantName: "Bassa Burger & Grill",
    logoUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80",
    primaryColor: "#E11D48", // Rose Red
    secondaryColor: "#0F172A", // Dark Slate
    phone: "5511999998888",
    slogan: "Hambúrgueres artesanais defumados & delícias na brasa",
    addressSummary: "Av. Paulista, 1500 - São Paulo, SP",
  },
  operatingHours: {
    mode: "auto",
    days: {
      segunda: { enabled: true, start: "18:00", end: "23:30" },
      terca: { enabled: true, start: "18:00", end: "23:30" },
      quarta: { enabled: true, start: "18:00", end: "23:30" },
      quinta: { enabled: true, start: "18:00", end: "23:30" },
      sexta: { enabled: true, start: "18:00", end: "23:59" },
      sabado: { enabled: true, start: "17:30", end: "23:59" },
      domingo: { enabled: true, start: "17:30", end: "23:00" },
    },
  },
  delivery: {
    defaultFee: 12.00,
    estimatedTimeMin: 35,
    estimatedTimeMax: 50,
    neighborhoods: [
      { id: "nb-1", name: "Centro", fee: 5.00 },
      { id: "nb-2", name: "Jardim América", fee: 7.00 },
      { id: "nb-3", name: "Bela Vista", fee: 8.00 },
      { id: "nb-4", name: "Vila Nova", fee: 10.00 },
      { id: "nb-5", name: "Santa Cecília", fee: 6.50 },
      { id: "nb-6", name: "Pinheiros", fee: 9.00 },
    ],
  },
  pixKey: "contato@bassaburger.com.br",
};

export const initialCategories: Category[] = [
  { id: "cat-burgers", name: "Hambúrgueres Artesanais", order: 1, icon: "🍔" },
  { id: "cat-combos", name: "Combos Especiais", order: 2, icon: "🍟" },
  { id: "cat-portions", name: "Porções & Entradas", order: 3, icon: "🍗" },
  { id: "cat-drinks", name: "Bebidas & Sucos", order: 4, icon: "🥤" },
  { id: "cat-desserts", name: "Sobremesas", order: 5, icon: "🍰" },
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    categoryId: "cat-burgers",
    name: "Bassa Smash Duplo Bacon",
    price: 38.90,
    description: "2x carnes smash 100g, queijo cheddar inglês derretido, fatias de bacon crocante artesanal e molho especial da casa no pão brioche amanteigado.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: true,
  },
  {
    id: "prod-2",
    categoryId: "cat-burgers",
    name: "Smoky Truffle Burger",
    price: 44.50,
    description: "Hambúrguer de costela 180g grelhado na brasa, queijo provolone empanado, maionese trufada e cebola caramelizada no pão australiano.",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: true,
  },
  {
    id: "prod-3",
    categoryId: "cat-burgers",
    name: "Classic Cheese Salada",
    price: 32.00,
    description: "Blend 160g de Angus, queijo prato, alface americana fresca, fatias de tomate maduro e maionese verde artesanal.",
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: false,
  },
  {
    id: "prod-4",
    categoryId: "cat-combos",
    name: "Combo Bassa Supremo",
    price: 52.90,
    description: "1 Bassa Smash Duplo + Batata Rústica Individual com Páprica Doce + 1 Refrigerante em lata 350ml à sua escolha.",
    imageUrl: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: true,
  },
  {
    id: "prod-5",
    categoryId: "cat-portions",
    name: "Batata Frita Rústica Especial",
    price: 24.00,
    description: "Batatas crocantes temperadas com alecrim fresco, sal marinho e servidas com molho sour cream e barbecue da casa.",
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: false,
  },
  {
    id: "prod-6",
    categoryId: "cat-portions",
    name: "Coxinhas de Costela Defumada (6 un)",
    price: 29.90,
    description: "Coxinhas recheadas com pura costela bovina desfiada e defumada por 8h, massa crocante e geleia de pimenta defumada.",
    imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: false,
  },
  {
    id: "prod-7",
    categoryId: "cat-drinks",
    name: "Refrigerante Lata 350ml",
    price: 7.50,
    description: "Coca-Cola, Coca Zero, Guaraná Antarctica ou Sprite geladíssimos.",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: false,
  },
  {
    id: "prod-8",
    categoryId: "cat-drinks",
    name: "Suco Natural de Laranja 500ml",
    price: 11.00,
    description: "Suco integral espremido na hora, 100% fruta sem adição de água ou conservantes.",
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: false,
  },
  {
    id: "prod-9",
    categoryId: "cat-desserts",
    name: "Milkshake Nutella com Ninho 400ml",
    price: 22.90,
    description: "Sorvete artesanal de baunilha batido com generosa camada de Nutella legítima e finalizado com leite Ninho polvilhado.",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: true,
  },
  {
    id: "prod-10",
    categoryId: "cat-desserts",
    name: "Brownie de Chocolate Belga com Calda",
    price: 18.50,
    description: "Brownie denso de cacau 70% com nozes, servido com calda morna de chocolate meio amargo.",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    available: true,
    featured: false,
  },
];

export const initialOrders: Order[] = [
  {
    id: "PED-1041",
    customerName: "Mariana Souza",
    customerPhone: "5511987654321",
    address: {
      street: "Rua das Flores",
      number: "245",
      neighborhood: "Centro",
      complement: "Apto 42B",
    },
    paymentMethod: "pix",
    items: [
      { productId: "prod-1", name: "Bassa Smash Duplo Bacon", price: 38.90, quantity: 1, notes: "Sem cebola" },
      { productId: "prod-7", name: "Refrigerante Lata 350ml", price: 7.50, quantity: 1, notes: "Coca Zero" }
    ],
    subtotal: 46.40,
    deliveryFee: 5.00,
    total: 51.40,
    status: "recebido",
    createdAt: Date.now() - 1000 * 60 * 8, // 8 mins ago
  },
  {
    id: "PED-1040",
    customerName: "Carlos Eduardo Mendes",
    customerPhone: "5511991234567",
    address: {
      street: "Alameda Santos",
      number: "1120",
      neighborhood: "Bela Vista",
      complement: "Bloco 2",
    },
    paymentMethod: "credit_card",
    items: [
      { productId: "prod-4", name: "Combo Bassa Supremo", price: 52.90, quantity: 2 },
      { productId: "prod-9", name: "Milkshake Nutella com Ninho 400ml", price: 22.90, quantity: 1 }
    ],
    subtotal: 128.70,
    deliveryFee: 8.00,
    total: 136.70,
    status: "em_preparo",
    createdAt: Date.now() - 1000 * 60 * 22, // 22 mins ago
  },
  {
    id: "PED-1039",
    customerName: "Juliana Ribeiro",
    customerPhone: "5511976543210",
    address: {
      street: "Rua Augusta",
      number: "890",
      neighborhood: "Centro",
      complement: "Casa 3",
    },
    paymentMethod: "cash",
    cashChangeFor: 100,
    items: [
      { productId: "prod-2", name: "Smoky Truffle Burger", price: 44.50, quantity: 1 },
      { productId: "prod-5", name: "Batata Frita Rústica Especial", price: 24.00, quantity: 1 }
    ],
    subtotal: 68.50,
    deliveryFee: 5.00,
    total: 73.50,
    status: "saiu_entrega",
    createdAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
  },
  {
    id: "PED-1038",
    customerName: "Roberto Alencar",
    customerPhone: "5511988887777",
    address: {
      street: "Rua Oscar Freire",
      number: "432",
      neighborhood: "Jardim América",
    },
    paymentMethod: "debit_card",
    items: [
      { productId: "prod-1", name: "Bassa Smash Duplo Bacon", price: 38.90, quantity: 2 },
      { productId: "prod-10", name: "Brownie de Chocolate Belga com Calda", price: 18.50, quantity: 2 }
    ],
    subtotal: 114.80,
    deliveryFee: 7.00,
    total: 121.80,
    status: "finalizado",
    createdAt: Date.now() - 1000 * 60 * 90, // 90 mins ago
  }
];
