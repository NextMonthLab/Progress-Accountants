import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Schema for SME Lead Form validation
const smeLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  business: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.string().optional(),
  message: z.string().min(10, "Please provide more details about your needs (minimum 10 characters)")
});

type SMELeadFormData = z.infer<typeof smeLeadSchema>;

interface NativeSMELeadFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function NativeSMELeadForm({ onSuccess, className = "" }: NativeSMELeadFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SMELeadFormData>({
    resolver: zodResolver(smeLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      business: "",
      industry: "",
      message: ""
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SMELeadFormData) => {
      return apiRequest('/api/forms/contact', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          source: 'sme-support-hub'
        })
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/forms/contact'] });
      toast({
        title: "Form submitted successfully!",
        description: "Thank you for your interest. We'll be in touch soon."
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SMELeadFormData) => {
    submitMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`text-center py-8 ${className}`}
      >
        <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Thank you!</h3>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Your submission has been received. We'll review your requirements and get back to you within 24 hours.
        </p>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-300">
            📧 Check your email for confirmation<br />
            📞 We'll call within 1 business day<br />
            📋 Your resources are now available for download
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Get Your Free SME Resources</h3>
        <p className="text-gray-300">
          Complete this form to access your downloadable SME support pack and get expert guidance.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01295 477 250"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              {...form.register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business" className="text-white font-medium">
              Business Name *
            </Label>
            <Input
              id="business"
              type="text"
              placeholder="Your business name"
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              {...form.register("business")}
            />
            {form.formState.errors.business && (
              <p className="text-red-400 text-sm">{form.formState.errors.business.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-white font-medium">
            Industry/Sector
          </Label>
          <Input
            id="industry"
            type="text"
            placeholder="e.g., Construction, Music, Film, Professional Services"
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
            {...form.register("industry")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-white font-medium">
            What support do you need? *
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us about your business needs, challenges, or specific areas where you'd like support..."
            rows={4}
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
            {...form.register("message")}
          />
          {form.formState.errors.message && (
            <p className="text-red-400 text-sm">{form.formState.errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitMutation.isPending}
          className="w-full relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0"
          style={{ 
            fontSize: 'clamp(16px, 2.5vw, 18px)',
            padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
            minHeight: '56px',
            borderRadius: '9999px',
            background: submitMutation.isPending 
              ? 'linear-gradient(90deg, #6B7280, #9CA3AF)' 
              : 'linear-gradient(90deg, #7C3AED, #EC4899)',
            boxShadow: submitMutation.isPending 
              ? '0 4px 14px rgba(107, 114, 128, 0.4)' 
              : '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
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
          {submitMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit & Get Resources
            </>
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          By submitting this form, you agree to receive communications from Progress Accountants about our services and resources.
        </p>
      </form>
    </motion.div>
  );
}