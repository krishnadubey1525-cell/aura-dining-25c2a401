import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, Mail, User, Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCreateReservation } from '@/hooks/useReservations';

export default function ReservationsPage() {
  const createReservation = useCreateReservation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createReservation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        date: formData.date,
        time: formData.time,
        party_size: parseInt(formData.partySize),
        notes: formData.notes || undefined,
      });

      setIsSubmitted(true);
      toast.success('Reservation submitted successfully!');
    } catch (error: any) {
      toast.error('Failed to submit reservation', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-secondary" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">
            Reservation Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8">
            We've received your reservation request. You'll receive a confirmation 
            email shortly with all the details.
          </p>
          <Button
            variant="gold"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                partySize: '',
                notes: '',
              });
            }}
          >
            Make Another Reservation
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="section-container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Reserve Your Experience
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            Book a <span className="text-gradient-gold">Table</span>
          </h1>
          <div className="divider-gold mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join us for an unforgettable dining experience. Reserve your table 
            and let us take care of the rest.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/50 p-6 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="h-12 bg-background border-border/50"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-secondary" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (234) 567-890"
                  required
                  className="h-12 bg-background border-border/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-secondary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="h-12 bg-background border-border/50"
                />
              </div>

              {/* Party Size */}
              <div className="space-y-2">
                <Label htmlFor="partySize" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-secondary" />
                  Party Size
                </Label>
                <Input
                  id="partySize"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.partySize}
                  onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                  placeholder="Number of guests"
                  required
                  className="h-12 bg-background border-border/50"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  Preferred Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="h-12 bg-background border-border/50"
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary" />
                  Preferred Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="h-12 bg-background border-border/50"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="notes">Special Requests (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any dietary restrictions, special occasions, or preferences..."
                rows={4}
                className="bg-background border-border/50 resize-none"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Confirm Reservation'
              )}
            </Button>
          </form>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 rounded-xl bg-muted/30">
            <Clock className="h-8 w-8 text-secondary mx-auto mb-3" />
            <h3 className="font-medium mb-1">Hours</h3>
            <p className="text-sm text-muted-foreground">
              Mon-Thu: 5PM-10PM<br />
              Fri-Sat: 5PM-11PM<br />
              Sun: 4PM-9PM
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-muted/30">
            <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
            <h3 className="font-medium mb-1">Large Parties</h3>
            <p className="text-sm text-muted-foreground">
              For parties of 10+, please<br />
              call us directly for<br />
              special arrangements.
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-muted/30">
            <Phone className="h-8 w-8 text-secondary mx-auto mb-3" />
            <h3 className="font-medium mb-1">Contact</h3>
            <p className="text-sm text-muted-foreground">
              +1 (234) 567-890<br />
              hello@lumiere.com
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
