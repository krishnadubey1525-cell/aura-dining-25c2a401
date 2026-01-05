import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, Phone, Mail, Clock, 
  Check, X, MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useReservations, useUpdateReservationStatus, ReservationStatus } from '@/hooks/useReservations';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';

export default function AdminReservationsPage() {
  const { data: reservations = [], isLoading } = useReservations();
  const updateStatus = useUpdateReservationStatus();
  const [filter, setFilter] = useState<string>('all');

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true;
    if (filter === 'today') return isToday(parseISO(res.date));
    if (filter === 'upcoming') return !isPast(parseISO(res.date));
    return res.status === filter;
  });

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    updateStatus.mutate({ id, status });
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <Calendar className="h-8 w-8 text-secondary" />
          Reservations
        </h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reservations</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading reservations...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {reservations.length === 0 
            ? 'No reservations yet.' 
            : 'No reservations match your filter.'
          }
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card border rounded-xl p-4 ${
                res.status === 'pending' ? 'border-amber-500/50' : 'border-border/50'
              }`}
            >
              <div className="flex flex-wrap items-start gap-4">
                {/* Date/Time Block */}
                <div className="bg-muted/50 rounded-lg p-3 text-center min-w-[100px]">
                  <p className="text-sm text-muted-foreground">{getDateLabel(res.date)}</p>
                  <p className="text-2xl font-bold">{res.time.slice(0, 5)}</p>
                </div>

                {/* Guest Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {res.status === 'pending' && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                        Pending
                      </span>
                    )}
                    {res.status === 'confirmed' && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Confirmed
                      </span>
                    )}
                    {res.status === 'cancelled' && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                        Cancelled
                      </span>
                    )}
                    {res.status === 'completed' && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-lg">{res.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {res.party_size} {res.party_size === 1 ? 'guest' : 'guests'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {res.phone}
                    </span>
                    {res.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {res.email}
                      </span>
                    )}
                  </div>
                  {res.notes && (
                    <p className="mt-2 text-sm bg-muted/30 rounded-lg p-2 flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {res.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {res.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-500 border-green-500/50 hover:bg-green-500/10"
                      onClick={() => handleStatusChange(res.id, 'confirmed')}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500/50 hover:bg-red-500/10"
                      onClick={() => handleStatusChange(res.id, 'cancelled')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
                {res.status === 'confirmed' && !isPast(parseISO(res.date)) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(res.id, 'completed')}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
