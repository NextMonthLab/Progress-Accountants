import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useBusinessIdentity } from "@/hooks/use-business-identity";

export default function FinanceDashboardPage() {
  const { businessIdentity, isLoading } = useBusinessIdentity();
  
  // Finance Dashboard embed code
  const IFRAME_EMBED_CODE = `<!-- Client Dashboard Widget -->
<iframe
  src="https://e40479db-edfd-4265-9a8b-1e462b5725d1-00-290zw6wfwpbn.picard.replit.dev/embed/client-dashboard?tenant=progress-accountants-uk"
  style="width: 100%; min-height: 700px; border: none; border-radius: 8px;"
  frameborder="0"
  scrolling="auto"
  sandbox="allow-scripts allow-same-origin"
  title="Client Dashboard"
></iframe>

<script>
  // Auto-resize iframe height
  window.addEventListener('message', function(event) {
    if (event.data.type === 'client-dashboard-resize' && event.data.height) {
      var iframe = document.querySelector('iframe[src*="/embed/client-dashboard"]');
      if (iframe) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });
</script>`;

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
        <title>Client Dashboard - {(businessIdentity as any)?.core?.businessName || 'Progress Accountants'}</title>
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
      <style dangerouslySetInnerHTML={{
        __html: `
          iframe {
            width: 100% !important;
            height: 100vh !important;
            border: none !important;
            display: block !important;
          }
        `
      }} />
    </div>
  );
}