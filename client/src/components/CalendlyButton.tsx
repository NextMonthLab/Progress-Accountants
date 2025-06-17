import { useEffect, useRef } from 'react';

const CalendlyButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for all other scripts to load, then create our button
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = `
          <div 
            id="calendly-btn-final"
            style="
              background-color: #f15a29;
              cursor: pointer;
              padding: 1.5rem 2rem;
              font-size: 1.125rem;
              border-radius: 0.5rem;
              border: none;
              color: white;
              font-weight: 500;
              transition: all 0.3s ease;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              outline: none;
              display: inline-block;
              text-align: center;
              user-select: none;
              text-decoration: none;
              font-family: system-ui, -apple-system, sans-serif;
              position: relative;
              z-index: 999999;
            "
          >
            👉 Let's build your growth engine — book your free discovery call
          </div>
        `;

        const btn = buttonRef.current.querySelector('#calendly-btn-final');
        if (btn) {
          // Remove any existing event listeners
          btn.removeEventListener('click', handleClick);
          
          // Add our click handler with highest priority
          btn.addEventListener('click', handleClick, { capture: true });
          
          // Add hover effects
          btn.addEventListener('mouseenter', () => {
            (btn as HTMLElement).style.transform = 'translateY(-2px)';
            (btn as HTMLElement).style.backgroundColor = '#e54e26';
          });
          
          btn.addEventListener('mouseleave', () => {
            (btn as HTMLElement).style.transform = 'translateY(0)';
            (btn as HTMLElement).style.backgroundColor = '#f15a29';
          });
        }
      }
    }, 2000); // Wait 2 seconds for all other scripts

    function handleClick(e: Event) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      
      console.log('Calendly button clicked - opening directly');
      
      // Multiple fallback methods
      try {
        // Method 1: Direct window.open
        const newWindow = window.open('https://calendly.com/progress-accountants/free-consultation-progress-accountants', '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          throw new Error('Popup blocked');
        }
      } catch (error) {
        // Method 2: Create temporary form
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = 'https://calendly.com/progress-accountants/free-consultation-progress-accountants';
        form.target = '_blank';
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
      
      return false;
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return <div ref={buttonRef} className="mb-10"></div>;
};

export default CalendlyButton;