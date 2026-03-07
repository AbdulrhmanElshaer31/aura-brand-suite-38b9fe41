import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

export type BrandSettings = Tables<'brand_settings'>;

export const useSettings = () => {
  return useQuery({
    queryKey: ['brand_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (error) throw error;
      return data as BrandSettings;
    },
  });
};

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: TablesUpdate<'brand_settings'>) => {
      const { error } = await supabase.from('brand_settings').update(updates).eq('id', 1);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brand_settings'] }),
  });
};

export const uploadLogo = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop();
  const fileName = `logo-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return data.publicUrl;
};
