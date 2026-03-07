import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, BrandSettings, DailyStats } from '@/types';

const defaultProducts: Product[] = [
  {
    id: 'p1',
    name: 'Midnight Oud',
    description: 'A captivating blend of rare oud wood and smoky amber that evokes the mystery of Arabian nights. This opulent fragrance opens with a burst of saffron and bergamot before revealing its dark, woody heart.',
    price: 320,
    category: 'woody',
    size: '100ml',
    status: 'available',
    badge: 'best_seller',
    images: [],
    topNotes: ['Saffron', 'Bergamot', 'Pink Pepper'],
    middleNotes: ['Oud Wood', 'Rose Absolute', 'Jasmine'],
    baseNotes: ['Amber', 'Musk', 'Sandalwood'],
    views: 245,
    orderClicks: 38,
    createdAt: '2025-01-15',
  },
  {
    id: 'p2',
    name: 'Velvet Rose',
    description: 'An enchanting floral symphony that captures the essence of a moonlit rose garden. Delicate yet powerful, this scent wraps you in layers of Bulgarian rose and creamy vanilla.',
    price: 280,
    category: 'sweet',
    size: '50ml',
    status: 'available',
    badge: 'new',
    images: [],
    topNotes: ['Raspberry', 'Lychee', 'Pink Pepper'],
    middleNotes: ['Bulgarian Rose', 'Peony', 'Iris'],
    baseNotes: ['Vanilla', 'White Musk', 'Cashmeran'],
    views: 189,
    orderClicks: 27,
    createdAt: '2025-02-01',
  },
  {
    id: 'p3',
    name: 'Citrus Royale',
    description: 'A refreshing burst of Mediterranean citrus blended with aromatic herbs and precious woods. Perfect for those who command attention with effortless sophistication.',
    price: 250,
    category: 'fresh',
    size: '75ml',
    status: 'available',
    badge: undefined,
    images: [],
    topNotes: ['Sicilian Lemon', 'Bergamot', 'Grapefruit'],
    middleNotes: ['Lavender', 'Rosemary', 'Neroli'],
    baseNotes: ['Vetiver', 'Cedar', 'White Musk'],
    views: 156,
    orderClicks: 19,
    createdAt: '2025-01-20',
  },
  {
    id: 'p4',
    name: 'Amber Noir',
    description: 'A bold and seductive composition built around precious amber and dark vanilla. This addictive fragrance leaves an unforgettable trail of warmth and sensuality.',
    price: 350,
    category: 'sweet',
    size: '100ml',
    status: 'available',
    badge: 'limited',
    images: [],
    topNotes: ['Cinnamon', 'Cardamom', 'Orange Blossom'],
    middleNotes: ['Amber', 'Benzoin', 'Tonka Bean'],
    baseNotes: ['Dark Vanilla', 'Patchouli', 'Leather'],
    views: 312,
    orderClicks: 45,
    createdAt: '2025-01-10',
  },
  {
    id: 'p5',
    name: 'Ocean Breeze',
    description: 'A crisp and invigorating marine fragrance that captures the essence of a pristine coastline. Light yet distinctive, it blends aquatic notes with aromatic woods.',
    price: 220,
    category: 'fresh',
    size: '50ml',
    status: 'available',
    images: [],
    topNotes: ['Sea Salt', 'Cucumber', 'Mint'],
    middleNotes: ['Lotus', 'Water Lily', 'Green Tea'],
    baseNotes: ['Driftwood', 'Ambergris', 'Musk'],
    views: 98,
    orderClicks: 12,
    createdAt: '2025-02-10',
  },
  {
    id: 'p6',
    name: 'Royal Sandalwood',
    description: 'A majestic blend of Indian sandalwood and exotic spices, crafted for the modern connoisseur. Timeless elegance in every drop.',
    price: 400,
    category: 'woody',
    size: '100ml',
    status: 'available',
    badge: 'best_seller',
    images: [],
    topNotes: ['Elemi', 'Cumin', 'Nutmeg'],
    middleNotes: ['Sandalwood', 'Cedarwood', 'Guaiac Wood'],
    baseNotes: ['Leather', 'Vetiver', 'Amber'],
    views: 278,
    orderClicks: 41,
    createdAt: '2025-01-05',
  },
];

const defaultSettings: BrandSettings = {
  brandName: 'MAISON ÉLÉGANCE',
  logoUrl: '',
  tagline: 'Where Luxury Meets Essence',
  primaryColor: '#C9A227',
  secondaryColor: '#E5C158',
  whatsappNumber: '966500000000',
  whatsappTemplate: 'السلام عليكم\nاريد طلب المنتج التالي:\n\nاسم المنتج: {product_name}\nالسعر: {price}\nكود المنتج: {product_id}',
  aboutText: 'We are a luxury perfume house dedicated to crafting exceptional fragrances that tell stories of elegance, passion, and sophistication. Each creation is a masterpiece born from the finest ingredients sourced from around the world.',
};

const defaultDailyStats: DailyStats[] = [
  { date: '2025-03-01', clicks: 12 },
  { date: '2025-03-02', clicks: 18 },
  { date: '2025-03-03', clicks: 15 },
  { date: '2025-03-04', clicks: 22 },
  { date: '2025-03-05', clicks: 28 },
  { date: '2025-03-06', clicks: 20 },
  { date: '2025-03-07', clicks: 25 },
];

interface StoreState {
  products: Product[];
  settings: BrandSettings;
  dailyStats: DailyStats[];
  adminPassword: string;
  isAdminLoggedIn: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (settings: Partial<BrandSettings>) => void;
  incrementViews: (id: string) => void;
  incrementOrderClicks: (id: string) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      settings: defaultSettings,
      dailyStats: defaultDailyStats,
      adminPassword: 'admin123',
      isAdminLoggedIn: false,

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      incrementViews: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, views: p.views + 1 } : p
          ),
        })),

      incrementOrderClicks: (id) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const stats = [...state.dailyStats];
          const todayIndex = stats.findIndex((s) => s.date === today);
          if (todayIndex >= 0) {
            stats[todayIndex] = { ...stats[todayIndex], clicks: stats[todayIndex].clicks + 1 };
          } else {
            stats.push({ date: today, clicks: 1 });
          }
          return {
            products: state.products.map((p) =>
              p.id === id ? { ...p, orderClicks: p.orderClicks + 1 } : p
            ),
            dailyStats: stats,
          };
        });
      },

      loginAdmin: (password) => {
        if (password === get().adminPassword) {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },

      logoutAdmin: () => set({ isAdminLoggedIn: false }),

      changePassword: (oldPassword, newPassword) => {
        if (oldPassword === get().adminPassword) {
          set({ adminPassword: newPassword });
          return true;
        }
        return false;
      },
    }),
    { name: 'perfume-store' }
  )
);
