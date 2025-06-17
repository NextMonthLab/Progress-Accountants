// Utility functions for Calendly integration

declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
      showPopupWidget: (url: string) => void;
    };
  }
}

export const openCalendlyPopup = () => {
  if (typeof window !== 'undefined') {
    // Function to try opening the popup
    const tryOpenPopup = () => {
      if (window.Calendly && window.Calendly.showPopupWidget) {
        window.Calendly.showPopupWidget('https://calendly.com/progress-accountants/free-consultation-progress-accountants');
        return true;
      }
      return false;
    };

    // Try immediately first
    if (tryOpenPopup()) {
      return;
    }

    // If Calendly is not ready, wait a bit and try again
    let attempts = 0;
    const maxAttempts = 10;
    const checkInterval = setInterval(() => {
      attempts++;
      if (tryOpenPopup() || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (attempts >= maxAttempts) {
          // Fallback to direct Calendly page if widget fails to load
          window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank');
        }
      }
    }, 100);
  }
};