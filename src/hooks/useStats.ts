import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDailyStats = () => {
  return useQuery({
    queryKey: ['daily_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};
