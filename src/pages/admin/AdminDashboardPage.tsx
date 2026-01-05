import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';

export default function AdminDashboardPage() {
  const { orders, reservations } = useAdminStore();
  
  const todayOrders = orders.filter(o => 
    new Date(o.placedAt).toDateString() === new Date().toDateString()
  );
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing');
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingReservations = reservations.filter(r => r.status === 'pending');

  const stats = [
    { label: "Today's Orders", value: todayOrders.length, icon: ShoppingBag, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Pending Orders', value: pendingOrders.length, icon: Clock, color: 'bg-amber-500/20 text-amber-400' },
    { label: "Today's Revenue", value: `$${todayRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-green-500/20 text-green-400' },
    { label: 'Pending Reservations', value: pendingReservations.length, icon: Calendar, color: 'bg-purple-500/20 text-purple-400' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border/50 p-6"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-border/50">
                  <td className="py-4 font-mono text-sm">{order.id}</td>
                  <td className="py-4">{order.customerName}</td>
                  <td className="py-4 text-muted-foreground">{order.items.length} items</td>
                  <td className="py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' :
                      order.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
