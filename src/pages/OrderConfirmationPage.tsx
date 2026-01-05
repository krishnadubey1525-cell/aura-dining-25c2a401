import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmationPage() {
  const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="section-container max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <Check className="h-12 w-12 text-secondary" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. We're preparing it with love.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Order ID: <span className="font-mono text-foreground">{orderId}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border border-border/50 p-6 mb-8"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Estimated Time</p>
                <p className="text-sm text-muted-foreground">30-45 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">To your address</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="hero" asChild>
            <Link to="/menu">
              Order More
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
