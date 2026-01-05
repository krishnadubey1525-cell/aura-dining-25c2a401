import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useOrders } from '@/hooks/useOrders';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

const COLORS = ['hsl(38, 92%, 50%)', 'hsl(350, 65%, 45%)', 'hsl(32, 95%, 44%)', 'hsl(200, 70%, 50%)', 'hsl(280, 60%, 50%)'];

export default function AdminAnalyticsPage() {
  const { orders, isLoading } = useOrders(false, false);

  // Orders per day (last 7 days)
  const ordersPerDay = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayOrders = orders.filter(o => {
        const orderDate = startOfDay(new Date(o.placed_at));
        return orderDate.getTime() === dayStart.getTime();
      });

      return {
        date: format(day, 'EEE'),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
      };
    });
  }, [orders]);

  // Best selling items
  const bestSellers = useMemo(() => {
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
        }
        itemCounts[item.name].count += item.quantity;
        itemCounts[item.name].revenue += item.price * item.quantity;
      });
    });

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  // Revenue by day (last 7 days)
  const revenueData = useMemo(() => {
    return ordersPerDay.map(d => ({
      date: d.date,
      revenue: d.revenue,
    }));
  }, [ordersPerDay]);

  // Summary stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    return [
      { label: 'Total Orders', value: totalOrders, icon: ShoppingBag },
      { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign },
      { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp },
      { label: 'Completed', value: deliveredOrders, icon: BarChart3 },
    ];
  }, [orders]);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">Loading analytics...</div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold flex items-center gap-3 mb-8">
        <BarChart3 className="h-8 w-8 text-secondary" />
        Analytics
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border/50 rounded-xl p-4"
          >
            <stat.icon className="h-6 w-6 text-secondary mb-2" />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Per Day Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4">Orders Per Day</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-6"
        >
          <h2 className="text-lg font-medium mb-4">Revenue (7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(350, 65%, 45%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(350, 65%, 45%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Best Sellers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/50 rounded-xl p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-medium mb-4">Best Selling Items</h2>
          {bestSellers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No data yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bestSellers}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {bestSellers.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {bestSellers.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.count} sold · ${item.revenue.toFixed(2)} revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
