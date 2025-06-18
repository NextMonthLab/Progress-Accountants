import { useEffect } from 'react';

export default function EmbeddedChatbot() {
  useEffect(() => {
    const chatbotId = 'progress-accountants-uk-chatbot-1750188617452';
    const chatbotUrl = 'https://e40479db-edfd-4265-9a8b-1e462b5725d1-00-290zw6wfwpbn.picard.replit.dev';
    
    console.log('SmartSite Chatbot: Loading chatbot', chatbotId, 'from', chatbotUrl);
    
    // Create and inject the chatbot script
    const script = document.createElement('script');
    script.id = 'smartsite-chatbot-script';
    script.type = 'text/javascript';
    script.async = true;
    script.src = `${chatbotUrl}/embed/${chatbotId}`;
    
    script.onload = () => {
      console.log('SmartSite Chatbot: Successfully loaded chatbot', chatbotId);
    };
    
    script.onerror = () => {
      console.error('SmartSite Chatbot: Failed to load chatbot script');
    };
    
    // Check if script already exists
    const existingScript = document.getElementById('smartsite-chatbot-script');
    if (!existingScript) {
      document.head.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      const scriptElement = document.getElementById('smartsite-chatbot-script');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}