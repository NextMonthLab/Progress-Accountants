import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useBusinessIdentity } from "@/hooks/use-business-identity";

export default function FinanceDashboardPage() {
  const { businessIdentity, isLoading } = useBusinessIdentity();
  
  // Configuration for iframe embed code
  // Replace this with your actual iframe embed code when ready
  const IFRAME_EMBED_CODE = `
    <!-- Replace this comment with your iframe embed code -->
    <!-- Example:
    <iframe 
      src="https://your-dashboard-url.com" 
      width="100%" 
      height="100%" 
      frameborder="0"
      style="border: none; min-height: 100vh;"
      allowfullscreen>
    </iframe>
    -->
  `;

  const [iframeEmbedCode, setIframeEmbedCode] = useState<string>('');

  useEffect(() => {
    // Check if we have actual iframe code (not just comments)
    const hasIframeContent = IFRAME_EMBED_CODE.includes('<iframe') && 
                            !IFRAME_EMBED_CODE.trim().startsWith('<!--');
    
    if (hasIframeContent) {
      setIframeEmbedCode(IFRAME_EMBED_CODE);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B3FE4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Helmet>
        <title>Client Dashboard - {businessIdentity?.core?.businessName || 'Progress Accountants'}</title>
        <meta name="description" content="Your personal financial dashboard with account summaries, documents, and deadlines." />
      </Helmet>
      
      {/* Full page iframe container with proper styling */}
      <div className="w-full h-screen relative">
        {iframeEmbedCode ? (
          <div 
            className="w-full h-full absolute inset-0"
            style={{
              // Ensure iframe fills entire viewport
              minHeight: '100vh',
              minWidth: '100vw'
            }}
            dangerouslySetInnerHTML={{ __html: iframeEmbedCode }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Financial Dashboard
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                This page is ready to display your embedded dashboard content.
              </p>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-3">
                  To add your iframe:
                </h3>
                <ol className="text-gray-300 space-y-2 text-sm">
                  <li>1. Replace the IFRAME_EMBED_CODE constant with your iframe code</li>
                  <li>2. Ensure your iframe includes width="100%" and height="100%"</li>
                  <li>3. The iframe will automatically fill the entire page</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS to ensure iframe responsiveness */}
      <style jsx>{`
        iframe {
          width: 100% !important;
          height: 100vh !important;
          border: none !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
}