import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationSettings {
  soundEnabled: boolean;
}

interface SettingsStore {
  soundEnabled: boolean;
  toggleSound: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'admin-settings' }
  )
);

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert to key-value object
      const settings: Record<string, any> = {};
      data?.forEach(item => {
        settings[item.key] = item.value;
      });
      return settings;
    },
  });
}

export function useUpdateAdminSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings updated');
    },
    onError: (error) => {
      toast.error('Failed to update settings', { description: error.message });
    }
  });
}
