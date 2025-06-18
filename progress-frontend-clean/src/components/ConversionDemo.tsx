import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConversionDemo = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cross-Generator Workflow Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Social Media Post Display */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Social Media Post with Conversion Button</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs inline-block mb-2">
                    Twitter
                  </div>
                  <p className="text-xs text-gray-500">
                    Created: May 14, 2025
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                  </button>
                  <button className="p-1 text-blue-500 hover:text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                    </svg>
                  </button>
                  <button className="p-1 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="text-sm whitespace-pre-wrap">Unlock your business's hidden potential with regular financial audits. Not only do they enhance transparency, but they identify areas where you can cut unnecessary expenses. #ProgressAccountants #BusinessGrowth</p>
              </div>
              
              {/* The enhanced convert to blog button */}
              <div className="flex justify-end mt-3">
                <button className="flex items-center gap-2 px-3 py-1.5 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                  </svg>
                  <span>Convert to Blog Post</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Step 2: Social Media Conversion Toast */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Conversion Toast Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-start gap-3">
                <div className="mt-0.5 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Converting to Blog Post</h3>
                  <p className="text-sm text-gray-600">Transforming your social media content into a blog post draft...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Step 3: Blog Post Generator Conversion Mode */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Step 3: Blog Post Generator with Enhanced Conversion Mode Indicator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              {/* Enhanced conversion mode banner */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-700">Social Media Conversion Mode</span>
                    <div className="text-xs text-blue-500 mt-0.5">Cross-Generator Workflow Active</div>
                  </div>
                </div>
                <div className="flex mt-3">
                  <div className="w-8 flex-shrink-0"></div>
                  <div className="flex-grow">
                    <p className="text-sm text-blue-700">
                      Expanding your social media post into a full blog article. The original content will be enhanced with more details, context, and depth while maintaining your brand voice.
                    </p>
                    <div className="mt-2 text-xs text-blue-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                        <path d="M3 12h2"></path>
                        <path d="M19 12h2"></path>
                        <path d="M12 3v2"></path>
                        <path d="M12 19v2"></path>
                        <path d="M7.8 7.8l-1.4 -1.4"></path>
                        <path d="M16.2 7.8l1.4 -1.4"></path>
                        <path d="M7.8 16.2l-1.4 1.4"></path>
                        <path d="M16.2 16.2l1.4 1.4"></path>
                      </svg>
                      <span>Content synchronization is active</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form representation */}
              <div className="mt-4 grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Topic</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value="Expanded from Twitter post: Financial audits for business savings"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Keywords</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value="financial audits, business growth, expense management, transparency, progress accountants"
                    readOnly
                  />
                </div>
                
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm">
                    Generate Blog Post
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Step 4: Success Message */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Step 4: Custom Conversion Success Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-start gap-3">
                <div className="mt-0.5 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6l-11 11l-5 -5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Social Media Expansion Complete! 🎉</h3>
                  <p className="text-sm text-gray-600">Your Twitter post has been successfully transformed into a full-length blog article with expanded details and depth.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConversionDemo;