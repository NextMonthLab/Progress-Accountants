import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ImageOptimizationDemo = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Image Optimization Demo | Progress</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Image Optimization</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                This page demonstrates image optimization techniques that improve website loading performance and user experience.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard vs Optimized Images</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Compare standard HTML images with optimized versions:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Standard Image:</h3>
                  <img 
                    src="https://res.cloudinary.com/demo/image/upload/sample.jpg" 
                    alt="Standard image example"
                    className="rounded-md w-full max-w-full h-auto"
                  />
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Image with Custom Dimensions:</h3>
                  <img 
                    src="https://res.cloudinary.com/demo/image/upload/w_600,h_400,c_fill/sample.jpg" 
                    alt="Optimized image example"
                    className="rounded-md w-full max-w-full h-auto"
                    width={600}
                    height={400}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Responsive Loading Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Images that adapt to different screen sizes:</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Using srcSet Attribute:</h3>
                  <img 
                    src="https://res.cloudinary.com/demo/image/upload/w_800,c_scale/sample.jpg"
                    srcSet="
                      https://res.cloudinary.com/demo/image/upload/w_400,c_scale/sample.jpg 400w,
                      https://res.cloudinary.com/demo/image/upload/w_800,c_scale/sample.jpg 800w,
                      https://res.cloudinary.com/demo/image/upload/w_1200,c_scale/sample.jpg 1200w
                    "
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt="Responsive image example"
                    className="rounded-md w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Object-Fit Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Different ways to display images within containers:</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">object-fit: cover</h3>
                  <div className="w-full h-[200px] bg-gray-100 overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/demo/image/upload/sample.jpg" 
                      alt="Object-fit cover example"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">object-fit: contain</h3>
                  <div className="w-full h-[200px] bg-gray-100 overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/demo/image/upload/sample.jpg" 
                      alt="Object-fit contain example"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Automatic lazy loading for better initial page load times</li>
                <li>Responsive images that load appropriately sized versions based on viewport</li>
                <li>Automatic quality optimization using Cloudinary</li>
                <li>Format optimization (WebP, AVIF) for modern browsers</li>
                <li>Loading skeleton states for better user experience</li>
                <li>Error fallback handling to prevent layout shifts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ImageOptimizationDemo;