import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface NextMonthPageWarningProps {
  pageTitle: string;
  onDuplicateClick?: () => void;
  showDuplicateButton?: boolean;
}

const NextMonthPageWarning: React.FC<NextMonthPageWarningProps> = ({ 
  pageTitle,
  onDuplicateClick,
  showDuplicateButton = true
}) => {
  const [, navigate] = useLocation();

  return (
    <Alert variant="destructive" className="mb-6 bg-gray-100 dark:bg-gray-800 border-amber-400">
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <AlertTitle className="text-amber-600 dark:text-amber-400 font-medium">
        Foundation Page - Limited Editing
      </AlertTitle>
      <AlertDescription className="mt-2 text-gray-700 dark:text-gray-300">
        <p className="mb-3">
          This page (<strong>{pageTitle}</strong>) was professionally designed by NextMonth and cannot be edited directly.
          To request changes, please contact support or create a custom page.
        </p>
        <div className="flex gap-3 mt-4">
          {showDuplicateButton && (
            <Button 
              variant="outline" 
              className="bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600 border-amber-300"
              onClick={onDuplicateClick}
            >
              Duplicate & Customize
            </Button>
          )}
          <Button 
            variant="outline" 
            className="bg-white dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-gray-600 border-amber-300"
            onClick={() => navigate('/page-builder')}
          >
            Back to Pages
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default NextMonthPageWarning;