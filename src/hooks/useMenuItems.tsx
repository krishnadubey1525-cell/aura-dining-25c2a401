import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  image_url?: string;
  is_available: boolean;
  is_visible: boolean;
  prep_time: number;
  tags: string[];
  calories?: number;
  allergens: string[];
  created_at: string;
  updated_at: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as MenuCategory[];
    },
  });
}

export function useMenuItems() {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item created');
    },
    onError: (error) => {
      toast.error('Failed to create item', { description: error.message });
    }
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MenuItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item updated');
    },
    onError: (error) => {
      toast.error('Failed to update item', { description: error.message });
    }
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete item', { description: error.message });
    }
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Omit<MenuCategory, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert([category])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      toast.success('Category created');
    },
    onError: (error) => {
      toast.error('Failed to create category', { description: error.message });
    }
  });
}
