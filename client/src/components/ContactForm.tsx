import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { smartFetch } from '@/utils/smartFetch';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  business: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  compact?: boolean;
  className?: string;
}

export default function ContactForm({ compact = false, className = "" }: ContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      business: '',
      industry: '',
      message: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      console.log('Form submission data:', data);
      
      // Direct fetch to local API endpoint
      const response = await fetch('/api/forms/progress-accountants-uk/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Form submission response:', result);
      
      // Reset the form on successful submission
      form.reset();
      
      toast({
        title: "Message Sent",
        description: "Thank you for your enquiry! We'll be in touch shortly.",
        variant: "default",
      });
    } catch (error) {
      console.error('Form submission failed:', error);
      
      toast({
        title: "Could not send message",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Use a different layout for the compact version
  if (compact) {
    return (
      <div className={`rounded-lg border border-gray-200 shadow-sm bg-white ${className}`}>
        <div className="p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4 gradient-text">Get in Touch</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-purple-600">Name*</FormLabel>
                      <FormControl>
                        <Input size={3} placeholder="Your name" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-purple-600">Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-purple-600">Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-purple-600">Business</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-purple-600">Message*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us how we can help" 
                        className="min-h-[80px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <button 
                type="submit"
                className="relative w-full inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)',
                  minHeight: '48px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  // Original full-size version
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#7B3FE4] font-medium">Name*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your full name" 
                    {...field} 
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#7B3FE4] font-medium">Email*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your email address" 
                    {...field} 
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#7B3FE4] font-medium">Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your phone number" 
                    {...field} 
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="business"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#7B3FE4] font-medium">Business Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your business name" 
                    {...field} 
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#7B3FE4] font-medium">Industry</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your industry" 
                  {...field} 
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#7B3FE4] font-medium">Message*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your business and how we can help you" 
                  className="min-h-[120px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <button 
          type="submit"
          className="relative w-full inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
            minHeight: '56px',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
            color: '#FFFFFF',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
            }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </Form>
  );
}