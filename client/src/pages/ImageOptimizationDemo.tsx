import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const ImageOptimizationDemo = () => {
  // Sample images to test with
  const images = {
    standard: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    landscape: 'https://res.cloudinary.com/demo/image/upload/v1582104765/sample.jpg',
    portrait: 'https://res.cloudinary.com/demo/image/upload/w_400,h_600,c_crop/sample.jpg',
    local: 'https://picsum.photos/800/600'
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Image Optimization Demo | Progress</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Image Optimization Demo</h1>
        
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>About Image Optimization</AlertTitle>
          <AlertDescription>
            This page demonstrates the image optimization components we've implemented to improve loading performance.
            These components automatically handle lazy loading, responsive sizing, and format optimization.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Image</CardTitle>
              <CardDescription>
                Basic implementation with standard HTML img tag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img 
                src={images.landscape} 
                alt="Sample landscape image"
                className="rounded-md w-full max-w-full h-auto"
                width={600}
                height={400}
                loading="lazy"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Image with Object-Fit</CardTitle>
              <CardDescription>
                Using object-fit: contain to maintain aspect ratio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-[400px] h-[400px]">
                <img 
                  src={images.portrait} 
                  alt="Sample portrait image"
                  className="rounded-md object-contain w-full h-full"
                  width={400}
                  height={400}
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Responsive Image with Picture Element</CardTitle>
              <CardDescription>
                Using picture element for different viewport sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <picture>
                <source media="(max-width: 640px)" srcSet="https://res.cloudinary.com/demo/image/upload/w_400,c_scale/sample.jpg" />
                <source media="(min-width: 641px) and (max-width: 768px)" srcSet="https://res.cloudinary.com/demo/image/upload/w_800,c_scale/sample.jpg" />
                <source media="(min-width: 769px)" srcSet="https://res.cloudinary.com/demo/image/upload/w_1200,c_scale/sample.jpg" />
                <img 
                  src={images.landscape} 
                  alt="Responsive image example"
                  className="rounded-md w-full h-auto"
                  loading="lazy"
                />
              </picture>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Benefits</CardTitle>
              <CardDescription>
                Key advantages of using our optimized image components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Automatic lazy loading for better initial page load times</li>
                <li>Responsive images that load appropriately sized versions based on viewport</li>
                <li>Automatic quality optimization for Cloudinary images</li>
                <li>Loading skeleton state for better user experience</li>
                <li>Error fallback handling to prevent layout shifts</li>
                <li>Support for object-fit controls to maintain visual consistency</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ImageOptimizationDemo;