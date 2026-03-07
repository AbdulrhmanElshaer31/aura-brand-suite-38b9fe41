import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Product = Tables<'products'>;

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useAddProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: TablesInsert<'products'>) => {
      const { data, error } = await supabase.from('products').insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'products'> }) => {
      const { error } = await supabase.from('products').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useIncrementViews = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Get current views then increment
      const { data } = await supabase.from('products').select('views').eq('id', id).single();
      if (data) {
        await supabase.from('products').update({ views: data.views + 1 }).eq('id', id);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useIncrementOrderClicks = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Increment product order_clicks
      const { data } = await supabase.from('products').select('order_clicks').eq('id', id).single();
      if (data) {
        await supabase.from('products').update({ order_clicks: data.order_clicks + 1 }).eq('id', id);
      }
      // Increment daily stats
      const today = new Date().toISOString().split('T')[0];
      const { data: stat } = await supabase.from('daily_stats').select('*').eq('date', today).single();
      if (stat) {
        await supabase.from('daily_stats').update({ clicks: stat.clicks + 1 }).eq('date', today);
      } else {
        await supabase.from('daily_stats').insert({ date: today, clicks: 1 });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['daily_stats'] });
    },
  });
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return data.publicUrl;
};
