import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Store, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/stores/cartStore';
import { useAdminStore } from '@/stores/adminStore';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { addOrder } = useAdminStore();
  const cartTotal = total();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    notes: '',
    promoCode: '',
  });

  const deliveryFee = orderType === 'delivery' ? 5.99 : 0;
  const tax = cartTotal * 0.08875; // NYC tax rate
  const grandTotal = cartTotal + deliveryFee + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    addOrder({
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: grandTotal,
      paymentMethod,
      status: 'new',
      isDelivery: orderType === 'delivery',
      address: orderType === 'delivery' ? {
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
        notes: formData.notes,
      } : undefined,
    });

    clearCart();
    setIsSubmitting(false);
    
    toast.success('Order placed successfully!');
    navigate('/order-confirmation');
  };

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Your cart is empty</h1>
          <Button variant="gold" asChild>
            <Link to="/menu">Browse Menu</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="section-container max-w-6xl">
        {/* Back button */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Order Type */}
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h2 className="text-xl font-display font-semibold mb-4">Order Type</h2>
                <RadioGroup
                  value={orderType}
                  onValueChange={(v) => setOrderType(v as 'delivery' | 'pickup')}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="delivery"
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      orderType === 'delivery'
                        ? 'border-secondary bg-secondary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Truck className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium">Delivery</p>
                      <p className="text-sm text-muted-foreground">30-45 mins</p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="pickup"
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      orderType === 'pickup'
                        ? 'border-secondary bg-secondary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Store className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium">Pickup</p>
                      <p className="text-sm text-muted-foreground">15-20 mins</p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {/* Contact Info */}
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h2 className="text-xl font-display font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12 bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12 bg-background border-border/50"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 bg-background border-border/50"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {orderType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card rounded-2xl border border-border/50 p-6"
                >
                  <h2 className="text-xl font-display font-semibold mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        required
                        className="h-12 bg-background border-border/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                          className="h-12 bg-background border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          required
                          className="h-12 bg-background border-border/50"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment */}
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h2 className="text-xl font-display font-semibold mb-4">Payment Method</h2>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as 'card' | 'cash')}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="card"
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-secondary bg-secondary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-secondary" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </Label>
                  <Label
                    htmlFor="cash"
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-secondary bg-secondary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <RadioGroupItem value="cash" id="cash" />
                    <span className="text-xl">💵</span>
                    <span className="font-medium">Cash on Delivery/Pickup</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Submit - Mobile */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Place Order • $${grandTotal.toFixed(2)}`}
                </Button>
              </div>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-6 sticky top-24"
            >
              <h2 className="text-xl font-display font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-gradient-gold">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <Label htmlFor="promo" className="text-sm">Promo Code</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="promo"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                    placeholder="Enter code"
                    className="h-10 bg-background border-border/50"
                  />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>

              {/* Submit - Desktop */}
              <div className="hidden lg:block mt-6">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
