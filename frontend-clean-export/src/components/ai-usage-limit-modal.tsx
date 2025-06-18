import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import { UsageAlert } from '@/hooks/use-ai-gateway';

interface AIUsageLimitModalProps {
  usageAlert: UsageAlert;
  onUseFallback: () => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export function AIUsageLimitModal({
  usageAlert,
  onUseFallback,
  onDismiss,
  isLoading = false
}: AIUsageLimitModalProps) {
  if (!usageAlert.show) return null;

  return (
    <Dialog open={usageAlert.show} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <DialogTitle>AI Usage Limit Reached</DialogTitle>
              <DialogDescription className="mt-1">
                You've reached your monthly limit for premium AI services
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Premium AI Limit Exceeded
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {usageAlert.message}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Task Type:</span>
              <Badge variant="secondary" className="capitalize">
                {usageAlert.taskType.replace('-', ' ')}
              </Badge>
            </div>
          </div>

          {usageAlert.fallbackAvailable && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/10">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Alternative Available
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You can continue using our basic AI model (Mistral 7B) with unlimited usage. 
                    While not as advanced as our premium models, it can still help with your request.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <span>✓ Unlimited usage</span>
                    <span>•</span>
                    <span>✓ No additional cost</span>
                    <span>•</span>
                    <span>✓ Instant processing</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onDismiss}
            disabled={isLoading}
          >
            Cancel Request
          </Button>
          
          {usageAlert.fallbackAvailable && (
            <Button
              onClick={onUseFallback}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Use Basic AI
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}