import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Search, Mail, Phone, Calendar, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface FormSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
}

export default function AdminContactSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['form-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FormSubmission[];
    },
  });

  const filteredSubmissions = submissions.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-secondary" />
          Contact Submissions
        </h1>
        <div className="text-sm text-muted-foreground">
          {submissions.length} total submissions
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or message..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Submissions List */}
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading submissions...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {submissions.length === 0 ? 'No submissions yet.' : 'No submissions match your search.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border/50 rounded-xl p-4 hover:border-secondary/30 transition-colors"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-lg">{submission.name}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {submission.email}
                    </span>
                    {submission.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {submission.phone}
                      </span>
                    )}
                  </div>
                  {submission.message && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {submission.message}
                    </p>
                  )}
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(submission.created_at), 'MMM d, yyyy h:mm a')}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-lg">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>Contact Submission</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-20">Name:</span>
                      <span className="font-medium">{selectedSubmission.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-20">Email:</span>
                      <a 
                        href={`mailto:${selectedSubmission.email}`} 
                        className="text-secondary hover:underline"
                      >
                        {selectedSubmission.email}
                      </a>
                    </div>
                    {selectedSubmission.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-20">Phone:</span>
                        <a 
                          href={`tel:${selectedSubmission.phone}`} 
                          className="text-secondary hover:underline"
                        >
                          {selectedSubmission.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-20">Submitted:</span>
                      <span>{format(new Date(selectedSubmission.created_at), 'MMMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                </div>

                {selectedSubmission.message && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Message</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    asChild
                  >
                    <a href={`mailto:${selectedSubmission.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </a>
                  </Button>
                  {selectedSubmission.phone && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      asChild
                    >
                      <a href={`tel:${selectedSubmission.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
