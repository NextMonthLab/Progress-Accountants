import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie, Settings } from 'lucide-react';
import { Link } from 'wouter';

export default function CookieNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if user has already consented to cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowSettings(!showSettings);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">We use cookies</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies. You can manage your preferences at any time.
              </p>
              <Link href="/cookie-policy" className="text-blue-400 hover:text-blue-300 text-sm underline">
                Learn more about our cookie policy
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomize}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
            >
              <Settings size={16} />
              Customize
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAcceptNecessary}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Necessary Only
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Accept All
            </Button>
          </div>
        </div>

        {showSettings && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-white font-semibold mb-4">Cookie Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Strictly Necessary</h5>
                  <p className="text-gray-400 text-sm">Required for the website to function properly</p>
                </div>
                <div className="text-gray-400 text-sm">Always Active</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Analytics</h5>
                  <p className="text-gray-400 text-sm">Help us understand how visitors interact with our website</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Functional</h5>
                  <p className="text-gray-400 text-sm">Enable enhanced functionality and personalization</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Advertising</h5>
                  <p className="text-gray-400 text-sm">Deliver relevant advertisements based on your interests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}