import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Calendar, LogOut, Settings } from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/reservations', label: 'Reservations', icon: Calendar },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { isAuthenticated, logout, user, orders } = useAdminStore();
  const location = useLocation();
  const newOrders = orders.filter(o => o.status === 'new').length;

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4 flex flex-col">
        <Link to="/" className="text-2xl font-display font-bold text-gradient-gold mb-8 px-2">
          Lumière
        </Link>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.label === 'Orders' && newOrders > 0 && (
                <span className="ml-auto bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                  {newOrders}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
