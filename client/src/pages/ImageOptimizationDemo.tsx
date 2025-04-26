import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

// Import optimized image components
import OptimizedImage from '@/components/OptimizedImage';
import ResponsiveImage from '@/components/ResponsiveImage';

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
        
        <Tabs defaultValue="optimized">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="optimized">OptimizedImage</TabsTrigger>
            <TabsTrigger value="responsive">ResponsiveImage</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimized">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard OptimizedImage</CardTitle>
                  <CardDescription>
                    Basic implementation with lazy loading and quality optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizedImage 
                    src={images.landscape} 
                    alt="Sample landscape image"
                    className="rounded-md"
                    width={600}
                    height={400}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>With Different Object-Fit</CardTitle>
                  <CardDescription>
                    Using object-fit: contain to maintain aspect ratio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizedImage 
                    src={images.portrait} 
                    alt="Sample portrait image"
                    className="rounded-md"
                    width={400}
                    height={400}
                    objectFit="contain"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lower Quality (Performance)</CardTitle>
                  <CardDescription>
                    Quality set to 30% to improve loading performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizedImage 
                    src={images.landscape} 
                    alt="Sample image with lower quality"
                    className="rounded-md"
                    width={600}
                    height={400}
                    quality={30}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>High Quality</CardTitle>
                  <CardDescription>
                    Quality set to 90% for better visual quality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizedImage 
                    src={images.landscape} 
                    alt="Sample image with higher quality"
                    className="rounded-md"
                    width={600}
                    height={400}
                    quality={90}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="responsive">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Responsive Image</CardTitle>
                  <CardDescription>
                    Automatically adapts to different screen sizes using the picture element
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveImage 
                    src={images.landscape} 
                    alt="Responsive sample image"
                    className="rounded-md w-full"
                    aspectRatio="16/9"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Breakpoints</CardTitle>
                  <CardDescription>
                    Using custom sources for different screen sizes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveImage 
                    src={images.landscape} 
                    alt="Responsive sample image with custom breakpoints"
                    className="rounded-md w-full"
                    aspectRatio="4/3"
                    breakpoints={{
                      sm: 'https://res.cloudinary.com/demo/image/upload/w_400,c_scale/sample.jpg',
                      md: 'https://res.cloudinary.com/demo/image/upload/w_800,c_scale/sample.jpg',
                      lg: 'https://res.cloudinary.com/demo/image/upload/w_1200,c_scale/sample.jpg',
                      xl: 'https://res.cloudinary.com/demo/image/upload/w_1600,c_scale/sample.jpg'
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard HTML Image</CardTitle>
                  <CardDescription>
                    Basic img tag without optimizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src={images.landscape} 
                    alt="Standard HTML image"
                    className="rounded-md w-full"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    No lazy loading, no optimized format, no loading state
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>OptimizedImage Component</CardTitle>
                  <CardDescription>
                    Our optimized image component
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizedImage 
                    src={images.landscape} 
                    alt="Optimized image"
                    className="rounded-md w-full"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    With lazy loading, loading state, and quality optimization
                  </p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ImageOptimizationDemo;