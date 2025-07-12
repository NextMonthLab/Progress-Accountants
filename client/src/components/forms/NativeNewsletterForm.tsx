import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle, Mail } from 'lucide-react';

const newsletterFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterFormSchema>;

interface NewsletterFormResponse {
  success: boolean;
  message: string;
  subscriptionId?: number;
  subscribedAt?: string;
}

interface NativeNewsletterFormProps {
  onSuccess?: (data: NewsletterFormResponse) => void;
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

export default function NativeNewsletterForm({ 
  onSuccess, 
  className = "", 
  placeholder = "Enter your email address",
  buttonText = "Subscribe"
}: NativeNewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema)
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'website'
        }),
      });

      const result: NewsletterFormResponse = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        reset();
        onSuccess?.(result);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Failed to subscribe');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              {...register('email')}
              type="email"
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 border-0 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg"
            style={{ 
              background: isSubmitting 
                ? 'linear-gradient(90deg, #6B7280, #9CA3AF)' 
                : 'linear-gradient(90deg, #7C3AED, #EC4899)',
              boxShadow: isSubmitting 
                ? '0 4px 14px rgba(107, 114, 128, 0.4)'
                : '0 4px 14px rgba(124, 58, 237, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3)',
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
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 flex items-center text-green-300 text-sm">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>{submitMessage}</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center text-red-300 text-sm">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>{submitMessage}</p>
          </div>
        )}
      </form>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-400 mt-3">
        By subscribing, you agree to receive our newsletter and can unsubscribe at any time.
      </p>
    </div>
  );
}