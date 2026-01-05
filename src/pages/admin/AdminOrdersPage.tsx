import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, Filter, ChevronDown, ChevronUp,
  MapPin, Phone, Mail, Clock, CreditCard, Banknote, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { useOrders, Order, OrderStatus } from '@/hooks/useOrders';
import { useSettingsStore } from '@/hooks/useAdminSettings';
import { format } from 'date-fns';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const { soundEnabled } = useSettingsStore();
  const { orders, isLoading, updateOrderStatus } = useOrders(true, soundEnabled);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus({ id: orderId, status: newStatus });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-secondary" />
          Orders
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Real-time updates active
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {orders.length === 0 ? 'No orders yet.' : 'No orders match your filters.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card border rounded-xl overflow-hidden ${
                order.status === 'new' ? 'border-secondary/50 shadow-lg shadow-secondary/10' : 'border-border/50'
              }`}
            >
              {/* Order Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {order.status === 'new' && (
                        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full animate-pulse">
                          NEW
                        </span>
                      )}
                      <span className="font-mono text-sm text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    <p className="font-medium mt-1">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">${Number(order.total).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" />
                      {format(new Date(order.placed_at), 'h:mm a')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-40">
                        <StatusBadge status={order.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                    >
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/50"
                  >
                    <div className="p-4 space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-2">Order Items</h4>
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            {order.payment_method === 'card' ? (
                              <CreditCard className="h-4 w-4" />
                            ) : (
                              <Banknote className="h-4 w-4" />
                            )}
                            Payment
                          </p>
                          <p className="font-medium capitalize">{order.payment_method}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium capitalize">{order.order_type}</p>
                        </div>
                        {order.delivery_address && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Delivery Address
                            </p>
                            <p className="font-medium">
                              {order.delivery_address.street}, {order.delivery_address.city} {order.delivery_address.zipCode}
                            </p>
                          </div>
                        )}
                      </div>

                      {order.notes && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order #{selectedOrder.id.slice(0, 8)}
                  <StatusBadge status={selectedOrder.status} />
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Customer</h4>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {selectedOrder.customer_phone}
                  </p>
                  {selectedOrder.customer_email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {selectedOrder.customer_email}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax</span>
                        <span>${Number(selectedOrder.tax).toFixed(2)}</span>
                      </div>
                      {Number(selectedOrder.delivery_fee) > 0 && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Delivery</span>
                          <span>${Number(selectedOrder.delivery_fee).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold mt-2">
                        <span>Total</span>
                        <span>${Number(selectedOrder.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h4 className="font-medium mb-2">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(opt => (
                      <Button
                        key={opt.value}
                        variant={selectedOrder.status === opt.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, opt.value);
                          setSelectedOrder({ ...selectedOrder, status: opt.value });
                        }}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
