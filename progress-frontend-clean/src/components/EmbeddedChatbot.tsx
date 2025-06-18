import { useEffect } from 'react';

export default function EmbeddedChatbot() {
  useEffect(() => {
    // TODO: Re-enable when backend Pallet chatbot service is deployed
    // Static deployment: Chatbot integration temporarily disabled
    
    const chatbotId = 'progress-accountants-uk-chatbot-1750188617452';
    console.log('Chatbot integration disabled for static deployment. Will reconnect when backend Pallet is available:', chatbotId);
    
    // Placeholder for future chatbot integration
    // const chatbotUrl = process.env.VITE_CHATBOT_SERVICE_URL;
    // if (chatbotUrl) {
    //   const script = document.createElement('script');
    //   script.src = `${chatbotUrl}/embed/${chatbotId}`;
    //   document.head.appendChild(script);
    // }
  }, []);

  return null; // This component doesn't render anything visible
}