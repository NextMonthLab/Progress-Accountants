import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Lock, ShieldAlert } from 'lucide-react';

/**
 * This is an emergency access page for when normal navigation is broken.
 * It provides direct links to important admin areas and functions.
 */
const AdminBypass: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  // Admin login credentials
  const loginCredentials = {
    username: 'manager',
    password: 'password'
  };
  
  // Login function
  const login = async () => {
    setLoading(true);
    setMessage('Attempting login...');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials)
      });
      
      if (response.ok) {
        setLoggedIn(true);
        setMessage('Login successful');
      } else {
        setMessage('Login failed: ' + (await response.text()));
      }
    } catch (error) {
      setMessage('Login error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // Trigger SOT check-in
  const triggerSOTCheckIn = async () => {
    setMessage('Triggering SOT check-in...');
    try {
      const response = await fetch('/api/client-check-in/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setMessage('SOT check-in result: ' + JSON.stringify(data));
    } catch (error) {
      setMessage('SOT check-in error: ' + (error as Error).message);
    }
  };
  
  // Generate site inventory
  const generateSiteInventory = async () => {
    setMessage('Generating site inventory...');
    try {
      const response = await fetch('/api/site-inventory/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setMessage('Site inventory result: ' + JSON.stringify(data));
    } catch (error) {
      setMessage('Site inventory error: ' + (error as Error).message);
    }
  };
  
  // Check login status on component mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    checkLogin();
  }, []);
  
  // Define admin areas
  const adminAreas = [
    { title: 'Dashboard', path: '/admin/dashboard', description: 'Main admin dashboard' },
    { title: 'SOT Management', path: '/admin/sot-management', description: 'Manage Source of Truth settings' },
    { title: 'Site Inventory', path: '/admin/inventory', description: 'View site inventory data' },
    { title: 'Pages', path: '/admin/pages', description: 'Manage website pages' },
    { title: 'Blog', path: '/admin/blog', description: 'Manage blog content' },
    { title: 'Settings', path: '/admin/settings', description: 'System settings' }
  ];
  
  // Define admin functions
  const adminFunctions = [
    { title: 'Trigger SOT Check-in', action: triggerSOTCheckIn, description: 'Manually trigger a Source of Truth check-in' },
    { title: 'Generate Site Inventory', action: generateSiteInventory, description: 'Generate a new site inventory snapshot' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-red-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Emergency Access</h1>
        </div>
        
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            This page provides direct access to admin functions when normal navigation is not working.
            Use these links to bypass UI issues and access important functionality.
          </p>
        </div>
        
        {!loggedIn ? (
          <div className="mb-8 p-6 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Login Required
            </h2>
            
            <Button
              disabled={loading}
              onClick={login}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
              Login as Admin
            </Button>
            
            {message && (
              <p className="mt-3 text-sm text-gray-600">{message}</p>
            )}
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Direct Access Links</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {adminAreas.map((area) => (
                <a
                  key={area.path}
                  href={area.path}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors no-underline"
                >
                  <h3 className="font-medium text-blue-600">{area.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{area.description}</p>
                </a>
              ))}
            </div>
            
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Admin Functions</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {adminFunctions.map((func) => (
                <button
                  key={func.title}
                  onClick={func.action}
                  className="text-left p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-green-600">{func.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{func.description}</p>
                </button>
              ))}
            </div>
            
            {message && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-medium mb-2">Response:</h3>
                <p className="text-sm text-gray-600 break-words">{message}</p>
              </div>
            )}
          </>
        )}
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          Emergency access page for system administrators only.
        </div>
      </div>
    </div>
  );
};

export default AdminBypass;