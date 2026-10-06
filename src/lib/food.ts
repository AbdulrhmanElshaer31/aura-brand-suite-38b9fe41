import type { Product } from '@/hooks/useProducts';

export interface DishSize { name: string; price: number }

export const getSizes = (p: Product): DishSize[] => {
  const raw = Array.isArray(p.sizes) ? (p.sizes as unknown as DishSize[]) : [];
  const valid = raw.filter((s) => s && typeof s.name === 'string' && Number(s.price) > 0)
    .map((s) => ({ name: s.name, price: Number(s.price) }));
  return valid.length ? valid : [{ name: p.size || '', price: Number(p.price) }];
};

export const minPrice = (p: Product) => Math.min(...getSizes(p).map((s) => s.price));

export const dishName = (p: Product, lang: string) => (lang === 'ar' && p.name_ar ? p.name_ar : p.name || p.name_ar);
export const dishDesc = (p: Product, lang: string) => (lang === 'ar' && p.description_ar ? p.description_ar : p.description || p.description_ar);
