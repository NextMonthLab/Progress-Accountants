import React, { useEffect } from 'react';

// Simple emergency navigation that won't rely on React routing
const EmergencyNavigation: React.FC = () => {
  useEffect(() => {
    // Add a plain HTML navigation menu after the component mounts
    const navContainer = document.createElement('div');
    navContainer.style.position = 'fixed';
    navContainer.style.left = '20px';
    navContainer.style.top = '20px';
    navContainer.style.backgroundColor = 'white';
    navContainer.style.padding = '15px';
    navContainer.style.borderRadius = '5px';
    navContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    navContainer.style.zIndex = '9999';
    
    // Menu title
    const title = document.createElement('h3');
    title.textContent = 'Emergency Navigation';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '14px';
    title.style.fontWeight = 'bold';
    navContainer.appendChild(title);
    
    // Create links
    const links = [
      { url: '/admin/dashboard', text: 'Dashboard' },
      { url: '/admin/pages', text: 'Pages' },
      { url: '/admin/sot-management', text: 'SOT Management' },
      { url: '/admin/inventory', text: 'Site Inventory' }
    ];
    
    links.forEach(link => {
      const linkElement = document.createElement('a');
      linkElement.href = link.url;
      linkElement.textContent = link.text;
      linkElement.style.display = 'block';
      linkElement.style.padding = '5px 0';
      linkElement.style.color = '#333';
      linkElement.style.textDecoration = 'none';
      
      // Force navigation with plain JS
      linkElement.onclick = (e) => {
        e.preventDefault();
        window.location.href = link.url;
        return false;
      };
      
      navContainer.appendChild(linkElement);
    });
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      document.body.removeChild(navContainer);
    };
    navContainer.appendChild(closeButton);
    
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