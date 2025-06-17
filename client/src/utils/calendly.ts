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
  if (typeof window !== 'undefined' && window.Calendly) {
    window.Calendly.showPopupWidget('https://calendly.com/progress-accountants/free-consultation-progress-accountants');
  } else {
    // Fallback to direct Calendly page if widget is not loaded
    window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank');
  }
};