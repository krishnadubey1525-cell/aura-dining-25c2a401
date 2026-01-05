import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'cash';
export type UserRole = 'owner' | 'manager' | 'staff';

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    addOns?: { name: string; price: number }[];
  }[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    notes?: string;
  };
  isDelivery: boolean;
  placedAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dateTime: Date;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

interface AdminState {
  isAuthenticated: boolean;
  user: { email: string; role: UserRole } | null;
  orders: Order[];
  reservations: Reservation[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addOrder: (order: Omit<Order, 'id' | 'placedAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
}

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'admin@restaurant.com',
  password: 'admin123',
  role: 'owner' as UserRole,
};

// Sample orders for demo
const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerPhone: '+1 (555) 123-4567',
    customerEmail: 'john@example.com',
    items: [
      { name: 'Truffle Risotto', quantity: 2, price: 34 },
      { name: 'Caesar Salad', quantity: 1, price: 16 },
    ],
    total: 84,
    paymentMethod: 'card',
    status: 'new',
    isDelivery: true,
    address: {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001',
    },
    placedAt: new Date(Date.now() - 5 * 60000),
    updatedAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerPhone: '+1 (555) 987-6543',
    items: [
      { name: 'Wagyu Steak', quantity: 1, price: 85 },
      { name: 'Red Wine', quantity: 2, price: 18 },
    ],
    total: 121,
    paymentMethod: 'card',
    status: 'preparing',
    isDelivery: false,
    placedAt: new Date(Date.now() - 20 * 60000),
    updatedAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    customerPhone: '+1 (555) 456-7890',
    items: [
      { name: 'Lobster Thermidor', quantity: 1, price: 65 },
      { name: 'Crème Brûlée', quantity: 2, price: 14 },
    ],
    total: 93,
    paymentMethod: 'cash',
    status: 'ready',
    isDelivery: true,
    address: {
      street: '456 Oak Ave',
      city: 'Brooklyn',
      zipCode: '11201',
    },
    placedAt: new Date(Date.now() - 45 * 60000),
    updatedAt: new Date(Date.now() - 10 * 60000),
  },
];

const sampleReservations: Reservation[] = [
  {
    id: 'RES-001',
    name: 'Sarah Williams',
    phone: '+1 (555) 111-2222',
    email: 'sarah@example.com',
    dateTime: new Date(Date.now() + 2 * 60 * 60000),
    partySize: 4,
    status: 'confirmed',
    notes: 'Anniversary dinner',
  },
  {
    id: 'RES-002',
    name: 'Robert Brown',
    phone: '+1 (555) 333-4444',
    dateTime: new Date(Date.now() + 24 * 60 * 60000),
    partySize: 6,
    status: 'pending',
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      orders: sampleOrders,
      reservations: sampleReservations,

      login: (email, password) => {
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          set({
            isAuthenticated: true,
            user: { email, role: DEMO_CREDENTIALS.role },
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
          placedAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? { ...order, status, updatedAt: new Date() }
              : order
          ),
        }));
      },

      addReservation: (reservation) => {
        const newReservation: Reservation = {
          ...reservation,
          id: `RES-${String(get().reservations.length + 1).padStart(3, '0')}`,
        };
        set((state) => ({
          reservations: [...state.reservations, newReservation],
        }));
      },

      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, status } : res
          ),
        }));
      },
    }),
    {
      name: 'restaurant-admin',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
