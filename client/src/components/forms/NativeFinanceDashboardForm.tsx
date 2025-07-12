import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Form validation schema for Finance Dashboard access
const financeDashboardFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  business: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  industry: z.string().min(1, { message: "Please select your industry." }),
  message: z.string().min(10, { message: "Please provide details about your finance dashboard requirements." }),
});

type FinanceDashboardFormData = z.infer<typeof financeDashboardFormSchema>;

interface NativeFinanceDashboardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NativeFinanceDashboardForm({ onSuccess, onCancel }: NativeFinanceDashboardFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FinanceDashboardFormData>({
    resolver: zodResolver(financeDashboardFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      business: '',
      industry: '',
      message: '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FinanceDashboardFormData) => {
      return apiRequest('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'finance_dashboard',
        }),
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/forms/contact'] });
      toast({
        title: "Dashboard Access Request Submitted",
        description: "Our team will contact you shortly to set up your personalized finance dashboard access.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FinanceDashboardFormData) => {
    submitMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Access Request Submitted
          </h3>
          <p className="text-slate-300 mb-6">
            Thank you for your interest in our Finance Dashboard. Our team will review your request and contact you within 24 hours to set up your personalized dashboard access.
          </p>
          <p className="text-slate-400 text-sm mb-6">
            You'll receive login credentials and a guided walkthrough of your dashboard features.
          </p>
          {onCancel && (
            <button
              onClick={onCancel}
              className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
              style={{ 
                fontSize: 'clamp(16px, 2.5vw, 18px)',
                padding: 'clamp(14px, 2.5vw, 16px) clamp(28px, 5vw, 40px)',
                minHeight: '48px',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
                color: '#FFFFFF',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Finance Dashboard Access
        </h2>
        <p className="text-slate-300 text-lg">
          Request access to your personalized financial dashboard with real-time insights, reports, and analytics.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Full Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your full name" 
                      {...field} 
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="your.email@company.com" 
                      {...field} 
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
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
                  <FormLabel className="text-white font-medium">Phone Number *</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="01295 477 250" 
                      {...field} 
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Business Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your business name" 
                      {...field} 
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">Industry *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:border-[#7C3AED] focus:ring-[#7C3AED]/20">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="professional-services">Professional Services</SelectItem>
                    <SelectItem value="construction">Construction & Engineering</SelectItem>
                    <SelectItem value="music">Music & Entertainment</SelectItem>
                    <SelectItem value="film">Film & Media Production</SelectItem>
                    <SelectItem value="technology">Technology & Software</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">Dashboard Requirements *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please describe your financial dashboard needs, reporting requirements, and any specific features you're looking for..."
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20 min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                minHeight: '56px',
                borderRadius: '9999px',
                background: submitMutation.isPending ? '#6B7280' : 'linear-gradient(90deg, #7C3AED, #EC4899)',
                boxShadow: submitMutation.isPending ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
                color: '#FFFFFF',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!submitMutation.isPending) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #6D28D9, #DB2777)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.6), 0 3px 12px rgba(236, 72, 153, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitMutation.isPending) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #7C3AED, #EC4899)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)';
                }
              }}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Request Dashboard Access'}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="relative inline-flex items-center justify-center font-bold border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-white/20"
                style={{ 
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  padding: 'clamp(14px, 2.5vw, 18px) clamp(28px, 5vw, 40px)',
                  minHeight: '56px',
                  borderRadius: '9999px',
                  background: 'transparent',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}