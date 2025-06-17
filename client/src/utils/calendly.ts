// Utility functions for Calendly integration

declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
      showPopupWidget: (url: string) => void;
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

export const openCalendlyPopup = () => {
  console.log('openCalendlyPopup called');
  
  if (typeof window !== 'undefined') {
    console.log('Window is available');
    console.log('Calendly object:', window.Calendly);
    
    // Try multiple methods to open Calendly
    const tryMethods = () => {
      // Method 1: Direct showPopupWidget
      if (window.Calendly && typeof window.Calendly.showPopupWidget === 'function') {
        console.log('Using showPopupWidget method');
        try {
          window.Calendly.showPopupWidget('https://calendly.com/progress-accountants/free-consultation-progress-accountants');
          return true;
        } catch (error) {
          console.error('showPopupWidget failed:', error);
        }
      }
      
      // Method 2: Init then show popup
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        console.log('Using initPopupWidget method');
        try {
          window.Calendly.initPopupWidget({
            url: 'https://calendly.com/progress-accountants/free-consultation-progress-accountants'
          });
          return true;
        } catch (error) {
          console.error('initPopupWidget failed:', error);
        }
      }
      
      return false;
    };

    // Try immediately first
    if (tryMethods()) {
      return;
    }

    console.log('Calendly methods not ready, starting retry loop');
    // If Calendly is not ready, wait and try again
    let attempts = 0;
    const maxAttempts = 20; // Increased attempts
    const checkInterval = setInterval(() => {
      attempts++;
      console.log(`Retry attempt ${attempts}, Calendly available:`, !!window.Calendly);
      
      if (tryMethods() || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (attempts >= maxAttempts) {
          console.log('Max attempts reached, opening fallback in new tab');
          // Fallback to direct Calendly page
          window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank');
        }
      }
    }, 200); // Increased interval
  } else {
    console.log('Window is not available');
  }
};