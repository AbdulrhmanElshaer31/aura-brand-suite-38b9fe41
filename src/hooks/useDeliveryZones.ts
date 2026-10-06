import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DeliveryZone { id: string; name: string; name_ar: string; fee: number; is_active: boolean; created_at: string }

export const useDeliveryZones = () =>
  useQuery({
    queryKey: ['delivery_zones'],
    queryFn: async () => {
      const { data, error } = await supabase.from('delivery_zones').select('*').order('created_at');
      if (error) throw error;
      return data as DeliveryZone[];
    },
  });

const useZoneMutation = <T,>(fn: (v: T) => Promise<void>) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ['delivery_zones'] }) });
};

export const useAddZone = () =>
  useZoneMutation(async (z: { name: string; name_ar: string; fee: number }) => {
    const { error } = await supabase.from('delivery_zones').insert(z);
    if (error) throw error;
  });

export const useUpdateZone = () =>
  useZoneMutation(async ({ id, ...u }: { id: string; fee?: number; is_active?: boolean }) => {
    const { error } = await supabase.from('delivery_zones').update(u).eq('id', id);
    if (error) throw error;
  });

export const useDeleteZone = () =>
  useZoneMutation(async (id: string) => {
    const { error } = await supabase.from('delivery_zones').delete().eq('id', id);
    if (error) throw error;
  });
