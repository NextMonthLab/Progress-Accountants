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
  console.log('🔵 openCalendlyPopup called');
  
  if (typeof window === 'undefined') {
    console.log('❌ Window is not available');
    return;
  }

  console.log('✅ Window is available');
  console.log('🔍 Calendly object:', window.Calendly);
  console.log('🔍 Calendly script loaded:', !!document.querySelector('script[src*="calendly.com"]'));

  // Immediate popup fallback - open in centered popup window
  const openPopupWindow = () => {
    console.log('🚀 Opening Calendly in popup window');
    const width = 700;
    const height = 800;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      'https://calendly.com/progress-accountants/free-consultation-progress-accountants',
      'calendly_popup',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  // Try Calendly widget methods
  const tryCalendlyWidget = () => {
    if (window.Calendly) {
      console.log('🔵 Calendly object found, available methods:', Object.keys(window.Calendly));
      
      // Method 1: showPopupWidget
      if (typeof window.Calendly.showPopupWidget === 'function') {
        console.log('✅ Using showPopupWidget method');
        try {
          window.Calendly.showPopupWidget('https://calendly.com/progress-accountants/free-consultation-progress-accountants');
          return true;
        } catch (error) {
          console.error('❌ showPopupWidget failed:', error);
        }
      }
      
      // Method 2: initPopupWidget
      if (typeof window.Calendly.initPopupWidget === 'function') {
        console.log('✅ Using initPopupWidget method');
        try {
          window.Calendly.initPopupWidget({
            url: 'https://calendly.com/progress-accountants/free-consultation-progress-accountants'
          });
          return true;
        } catch (error) {
          console.error('❌ initPopupWidget failed:', error);
        }
      }
      
      console.log('❌ No valid Calendly popup methods found');
    } else {
      console.log('❌ Calendly object not found');
    }
    return false;
  };

  // Try Calendly widget first
  if (tryCalendlyWidget()) {
    console.log('✅ Calendly widget opened successfully');
    return;
  }

  // For now, always use the popup window as it's more reliable
  console.log('🔄 Calendly widget not ready, using popup window');
  openPopupWindow();
};