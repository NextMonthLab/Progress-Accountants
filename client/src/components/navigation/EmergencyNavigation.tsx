import React, { useEffect } from 'react';

// Simple emergency navigation that won't rely on React routing
const EmergencyNavigation: React.FC = () => {
  useEffect(() => {
    // Add a plain HTML navigation menu after the component mounts
    const navContainer = document.createElement('div');
    navContainer.style.position = 'fixed';
    navContainer.style.left = '20px';
    navContainer.style.top = '70px';
    navContainer.style.backgroundColor = 'white';
    navContainer.style.padding = '15px';
    navContainer.style.borderRadius = '5px';
    navContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    navContainer.style.zIndex = '9999';
    navContainer.style.maxHeight = '80vh';
    navContainer.style.overflowY = 'auto';
    
    // Menu title
    const title = document.createElement('h3');
    title.textContent = 'Emergency Navigation';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    title.style.color = '#e65c00';  // Orange color
    navContainer.appendChild(title);
    
    // Create section with important admin links
    const addSection = (title: string, links: { url: string; text: string }[]) => {
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = title;
      sectionTitle.style.fontSize = '12px';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.textTransform = 'uppercase';
      sectionTitle.style.marginTop = '10px';
      sectionTitle.style.marginBottom = '5px';
      sectionTitle.style.color = '#555';
      navContainer.appendChild(sectionTitle);
      
      links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.textContent = link.text;
        linkElement.style.display = 'block';
        linkElement.style.padding = '5px 0';
        linkElement.style.color = '#333';
        linkElement.style.fontSize = '14px';
        linkElement.style.textDecoration = 'none';
        
        // Force navigation with plain JS
        linkElement.onclick = (e) => {
          e.preventDefault();
          window.location.href = link.url;
          return false;
        };
        
        navContainer.appendChild(linkElement);
      });
    };
    
    // Main sections
    addSection('Core', [
      { url: '/admin/dashboard', text: 'Dashboard' },
      { url: '/admin/pages', text: 'Pages' },
      { url: '/admin/users', text: 'Users' }
    ]);
    
    addSection('SOT System', [
      { url: '/admin/sot-management', text: 'SOT Management' },
      { url: '/admin/inventory', text: 'Site Inventory' }
    ]);
    
    addSection('Content', [
      { url: '/admin/blog', text: 'Blog' },
      { url: '/admin/media', text: 'Media' },
      { url: '/admin/marketplace', text: 'Marketplace' }
    ]);
    
    addSection('Settings', [
      { url: '/admin/settings', text: 'Settings' },
      { url: '/admin/profile', text: 'Profile' }
    ]);
    
    // Add SOT specific actions
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '15px';
    buttonContainer.style.padding = '10px 0';
    buttonContainer.style.borderTop = '1px solid #eee';
    
    const addButton = (text: string, action: () => void, color = '#4f46e5') => {
      const button = document.createElement('button');
      button.textContent = text;
      button.style.display = 'block';
      button.style.marginBottom = '5px';
      button.style.padding = '8px 12px';
      button.style.backgroundColor = color;
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.width = '100%';
      button.style.fontSize = '12px';
      button.onclick = action;
      
      buttonContainer.appendChild(button);
    };
    
    addButton('Trigger SOT Check-in', () => {
      fetch('/api/client-check-in/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
        alert('SOT Check-in triggered: ' + (data.success ? 'Success' : 'Failed'));
      })
      .catch(err => {
        alert('Error triggering SOT check-in: ' + err.message);
      });
    });
    
    addButton('Generate Site Inventory', () => {
      fetch('/api/site-inventory/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
        alert('Site inventory generated: ' + (data.success ? 'Success' : 'Failed'));
      })
      .catch(err => {
        alert('Error generating site inventory: ' + err.message);
      });
    });
    
    navContainer.appendChild(buttonContainer);
    
    // Close/minimize controls
    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.top = '5px';
    controlsContainer.style.right = '5px';
    
    // Minimize button
    const minimizeButton = document.createElement('button');
    minimizeButton.textContent = '_';
    minimizeButton.style.border = 'none';
    minimizeButton.style.background = 'none';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.marginRight = '5px';
    minimizeButton.onclick = () => {
      const currentContent = navContainer.querySelector('.content');
      if (currentContent) {
        if (currentContent.style.display === 'none') {
          currentContent.style.display = 'block';
          navContainer.style.width = 'auto';
          navContainer.style.height = 'auto';
        } else {
          currentContent.style.display = 'none';
          navContainer.style.width = '30px';
          navContainer.style.height = '30px';
        }
      }
    };
    controlsContainer.appendChild(minimizeButton);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      document.body.removeChild(navContainer);
    };
    controlsContainer.appendChild(closeButton);
    
    navContainer.appendChild(controlsContainer);
    
    // Wrap all content in a div for minimize functionality
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content';
    // Move all elements except controls into content wrapper
    while (navContainer.children.length > 1) {
      const child = navContainer.firstChild;
      if (child !== controlsContainer) {
        contentWrapper.appendChild(child!);
      }
    }
    navContainer.insertBefore(contentWrapper, controlsContainer);
    
    // Add to document
    document.body.appendChild(navContainer);
    
    // Cleanup
    return () => {
      if (document.body.contains(navContainer)) {
        document.body.removeChild(navContainer);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default EmergencyNavigation;