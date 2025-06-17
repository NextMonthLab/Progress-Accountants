// External Form Embed Configuration
// Replace these empty strings with your actual iframe embed codes when ready

export const EMBED_FORMS = {
  // Contact page form
  CONTACT_FORM: `
    <!-- Replace with your contact form iframe embed code -->
  `,
  
  // Business Calculator lead capture form (required before download)
  BUSINESS_CALCULATOR_LEAD_FORM: `
    <!-- Replace with your business calculator lead form iframe embed code -->
  `,
  
  // SME Support Hub lead capture form
  SME_SUPPORT_LEAD_FORM: `
    <!-- Replace with your SME support hub lead form iframe embed code -->
  `,
  
  // Client dashboard embed code
  CLIENT_DASHBOARD: `<!-- Client Dashboard Widget -->
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
</script>`
};

// Helper function to check if embed code is ready
export const hasValidEmbedCode = (embedCode: string): boolean => {
  return embedCode.includes('<iframe') && 
         !embedCode.trim().startsWith('<!--') &&
         embedCode.trim() !== '';
};

// Form configuration
export const FORM_CONFIG = {
  defaultHeight: '600px',
  downloadRequiresForm: true, // Set to false to allow downloads without form completion
  formContainerClass: 'w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 p-6 rounded-xl shadow-lg',
  iframeClass: 'w-full border-0 rounded-lg'
};