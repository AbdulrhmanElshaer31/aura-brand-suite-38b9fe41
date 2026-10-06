import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/hooks/useProducts';

export interface CartItem {
  key: string;
  product: Product;
  sizeName: string;
  unitPrice: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, sizeName: string, unitPrice: number, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, sizeName, unitPrice, qty = 1) => {
        const key = `${product.id}::${sizeName}`;
        const items = get().items;
        if (items.some((i) => i.key === key)) {
          set({ items: items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i)) });
        } else {
          set({ items: [...items, { key, product, sizeName, unitPrice, quantity: qty }] });
        }
      },
      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      updateQuantity: (key, quantity) =>
        set({ items: quantity <= 0 ? get().items.filter((i) => i.key !== key) : get().items.map((i) => (i.key === key ? { ...i, quantity } : i)) }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    }),
    {
      name: 'wizo-cart',
      version: 2,
      migrate: () => ({ items: [] }) as unknown as CartStore,
    }
  )
);
