import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  party_size: number;
  status: ReservationStatus;
  notes?: string;
  created_at: string;
}

export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      
      if (error) throw error;
      return data as Reservation[];
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservationStatus }) => {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reservation updated');
    },
    onError: (error) => {
      toast.error('Failed to update reservation', { description: error.message });
    }
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{ ...reservation, status: 'pending' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    }
  });
}
