import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Sun, Moon, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettingsStore, useAdminSettings } from '@/hooks/useAdminSettings';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { soundEnabled, toggleSound, theme, setTheme } = useSettingsStore();
  const { data: adminSettings } = useAdminSettings();

  return (
    <div>
      <h1 className="text-3xl font-display font-bold flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-secondary" />
        Settings
      </h1>

      <div className="max-w-2xl space-y-6">
        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">Administrator</p>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound">Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Play a sound when new orders arrive
                </p>
              </div>
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-secondary" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={toggleSound}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Switch between dark and light mode
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Business Settings (Read-only display) */}
        {adminSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border/50 rounded-xl p-6"
          >
            <h2 className="text-lg font-medium mb-4">Business Settings</h2>
            <div className="space-y-4">
              {adminSettings.tax_rate && (
                <div>
                  <p className="text-sm text-muted-foreground">Tax Rate</p>
                  <p className="font-medium">{adminSettings.tax_rate.percentage}%</p>
                </div>
              )}
              {adminSettings.delivery_zones && (
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Zones</p>
                  <div className="mt-2 space-y-2">
                    {adminSettings.delivery_zones.zones?.map((zone: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm bg-muted/30 rounded-lg p-2">
                        <span>{zone.name} ({zone.radius_km}km)</span>
                        <span className="font-medium">${zone.fee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
