import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * A hook that prevents navigation when there are unsaved changes
 * 
 * @param isDirty - Boolean indicating whether there are unsaved changes
 * @param message - Optional custom message to display in the confirmation dialog
 */
export function useNavigationLock(
  isDirty: boolean,
  message: string = 'You have unsaved changes. Are you sure you want to leave this page?'
) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Function to handle beforeunload event
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      
      // Standard way of showing a confirmation dialog before unloading
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // Add event listener for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);

  // Return a navigation function that respects unsaved changes
  return {
    navigate: (to: string) => {
      if (!isDirty || window.confirm(message)) {
        setLocation(to);
      }
    }
  };
}