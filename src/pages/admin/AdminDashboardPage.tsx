import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Clock, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useReservations } from '@/hooks/useReservations';
import { useSettingsStore } from '@/hooks/useAdminSettings';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const { soundEnabled } = useSettingsStore();
  const { orders, isLoading: ordersLoading } = useOrders(true, soundEnabled);
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations();
  
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => 
    new Date(o.placed_at).toDateString() === today
  );
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing');
  const completedToday = todayOrders.filter(o => o.status === 'delivered').length;
  const todayRevenue = todayOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingReservations = reservations.filter(r => r.status === 'pending');

  const stats = [
    { label: "Today's Orders", value: todayOrders.length, icon: ShoppingBag, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Pending Orders', value: pendingOrders.length, icon: Clock, color: 'bg-amber-500/20 text-amber-400' },
    { label: 'Completed Today', value: completedToday, icon: CheckCircle, color: 'bg-green-500/20 text-green-400' },
    { label: "Today's Revenue", value: `$${todayRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-emerald-500/20 text-emerald-400' },
    { label: 'Pending Reservations', value: pendingReservations.length, icon: Calendar, color: 'bg-purple-500/20 text-purple-400' },
  ];

  const isLoading = ordersLoading || reservationsLoading;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border/50 p-5"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">
              {isLoading ? '...' : stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Recent Orders
        </h2>
        
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No orders yet. Orders will appear here in real-time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="border-b border-border/50">
                    <td className="py-4 font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground hidden md:table-cell">
                      {order.items?.length || 0} items
                    </td>
                    <td className="py-4 font-medium">${Number(order.total).toFixed(2)}</td>
                    <td className="py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {format(new Date(order.placed_at), 'MMM d, h:mm a')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400',
    preparing: 'bg-amber-500/20 text-amber-400',
    ready: 'bg-green-500/20 text-green-400',
    out_for_delivery: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  const labels: Record<string, string> = {
    new: 'New',
    preparing: 'Preparing',
    ready: 'Ready',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-muted text-muted-foreground'}`}>
      {labels[status] || status}
    </span>
  );
}
