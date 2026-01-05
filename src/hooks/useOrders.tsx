import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash' | 'card';
export type OrderType = 'delivery' | 'pickup';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  addOns?: { name: string; price: number }[];
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  order_type: OrderType;
  delivery_address?: {
    street: string;
    city: string;
    zipCode: string;
    notes?: string;
  };
  status: OrderStatus;
  notes?: string;
  placed_at: string;
  updated_at: string;
}

// Sound notification
const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.play().catch(() => {
    // Fallback beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  });
};

export function useOrders(enableRealtime = false, soundEnabled = true) {
  const queryClient = useQueryClient();
  const previousOrderCountRef = useRef<number>(0);
  const isFirstLoadRef = useRef(true);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('placed_at', { ascending: false });
      
      if (error) throw error;
      
      // Parse items JSON
      return (data || []).map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        delivery_address: order.delivery_address ? 
          (typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address) : null
      })) as Order[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!enableRealtime) return;

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order change:', payload);
          
          if (payload.eventType === 'INSERT' && !isFirstLoadRef.current && soundEnabled) {
            playNotificationSound();
            toast.success('New order received!', {
              description: `Order from ${(payload.new as any).customer_name}`,
            });
          }
          
          // Refetch orders
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    // Mark first load complete after a short delay
    setTimeout(() => {
      isFirstLoadRef.current = false;
    }, 2000);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enableRealtime, soundEnabled, queryClient]);

  // Track order count for notifications
  useEffect(() => {
    if (orders.length > previousOrderCountRef.current && !isFirstLoadRef.current && soundEnabled) {
      const newOrdersCount = orders.length - previousOrderCountRef.current;
      if (newOrdersCount > 0) {
        // New orders added
      }
    }
    previousOrderCountRef.current = orders.length;
  }, [orders.length, soundEnabled]);

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: (error) => {
      toast.error('Failed to update order', { description: error.message });
    }
  });

  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus: updateOrderStatus.mutate,
    newOrdersCount,
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'placed_at' | 'updated_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          items: order.items as unknown as Json,
          subtotal: order.subtotal,
          tax: order.tax,
          delivery_fee: order.delivery_fee,
          total: order.total,
          payment_method: order.payment_method,
          order_type: order.order_type,
          delivery_address: order.delivery_address as unknown as Json,
          notes: order.notes,
          status: 'new'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}
