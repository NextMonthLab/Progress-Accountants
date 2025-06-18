import { useEffect } from 'react';

export default function EmbeddedChatbot() {
  useEffect(() => {
    // Pure iframe embed model - no backend dependencies
    const chatbotId = 'progress-accountants-uk-chatbot-1750188617452';
    
    // Create iframe embed container if needed
    const existingContainer = document.getElementById('chatbot-embed-container');
    if (!existingContainer) {
      const container = document.createElement('div');
      container.id = 'chatbot-embed-container';
      container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000;';
      
      // Graceful fallback if embed service unavailable
      container.innerHTML = `
        <iframe 
          src="${process.env.VITE_CHATBOT_SERVICE_URL || ''}/embed/${chatbotId}"
          width="300" 
          height="400"
          frameborder="0"
          style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
          onError="this.style.display='none'"
        ></iframe>
      `;
      
      if (process.env.VITE_CHATBOT_SERVICE_URL) {
        document.body.appendChild(container);
      }
    }
  }, []);

  return null; // This component doesn't render anything visible
}