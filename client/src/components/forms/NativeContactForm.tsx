import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, Building, MessageSquare } from 'lucide-react';
import { FadeIn } from '@/components/ui/ScrollAnimation';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  business: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormResponse {
  success: boolean;
  message: string;
  submissionId?: number;
  submittedAt?: string;
}

interface NativeContactFormProps {
  onSuccess?: (data: ContactFormResponse) => void;
  className?: string;
}

export default function NativeContactForm({ onSuccess, className = "" }: NativeContactFormProps) {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'website'
        }),
      });

      const result: ContactFormResponse = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        reset();
        onSuccess?.(result);
        // Redirect to thank you page after a brief delay
        setTimeout(() => {
          setLocation('/thank-you');
        }, 1500);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Failed to submit form');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <FadeIn delay={0.1}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Full Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="inline h-4 w-4 mr-2" />
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              <Phone className="inline h-4 w-4 mr-2" />
              Phone Number
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Two column layout for Business and Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Field */}
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-300 mb-2">
                <Building className="inline h-4 w-4 mr-2" />
                Business Name
              </label>
              <input
                {...register('business')}
                type="text"
                id="business"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Your business name"
              />
            </div>

            {/* Industry Field */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                Industry Sector
              </label>
              <select
                {...register('industry')}
                id="industry"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="">Select industry</option>
                <option value="accounting">Accounting</option>
                <option value="construction">Construction</option>
                <option value="film">Film & Media</option>
                <option value="music">Music & Entertainment</option>
                <option value="professional-services">Professional Services</option>
                <option value="retail">Retail</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="hospitality">Hospitality</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="inline h-4 w-4 mr-2" />
              Message *
            </label>
            <textarea
              {...register('message')}
              id="message"
              rows={6}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
              placeholder="Tell us about your business needs and how we can help..."
            ></textarea>
            {errors.message && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center text-green-300">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <p>{submitMessage}</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center text-red-300">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <p>{submitMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative inline-flex items-center justify-center font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                padding: 'clamp(16px, 2.5vw, 20px) clamp(32px, 6vw, 48px)',
                minHeight: '56px',
                borderRadius: '9999px',
                background: isSubmitting 
                  ? 'linear-gradient(90deg, #6B7280, #9CA3AF)' 
                  : 'linear-gradient(90deg, #7C3AED, #EC4899)',
                boxShadow: isSubmitting 
                  ? '0 4px 14px rgba(107, 114, 128, 0.4), 0 2px 8px rgba(156, 163, 175, 0.3)'
                  : '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
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
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-400 text-center mt-4">
            By submitting this form, you agree to our privacy policy. We'll contact you within 24 hours to discuss your requirements.
          </p>
        </form>
      </FadeIn>
    </div>
  );
}