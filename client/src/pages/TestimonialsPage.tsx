import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';

// Define the data structure for a testimonial
interface Testimonial {
  name: string;
  company: string;
  industry: string;
  quote: string;
  rating: number;
}

// Define the data structure for the testimonials page
interface TestimonialsPageData {
  intro: string;
  testimonials: Testimonial[];
  display_style: 'cards' | 'carousel' | 'list' | 'grid';
  show_ratings: boolean;
}

// Define a type for the business identity response
interface BusinessIdentity {
  core: {
    businessName: string;
    industry: string;
    location: string;
  };
  // other properties might exist
}

export default function TestimonialsPage() {
  // Fetch business identity data
  const { data: business } = useQuery<BusinessIdentity>({
    queryKey: ['/api/business-identity'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsPageData>({
    intro: "Here's what our clients say about working with Progress Accountants...",
    testimonials: [],
    display_style: 'cards',
    show_ratings: true
  });
  
  // Load testimonials data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('project_context.testimonials_page');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as TestimonialsPageData;
        setTestimonialsData(parsedData);
      } catch (error) {
        console.error('Error parsing testimonials data:', error);
      }
    }
  }, []);
  
  // Helper to render star ratings
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  // Render testimonials based on display style
  const renderTestimonials = () => {
    if (testimonialsData.testimonials.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">No testimonials have been added yet.</p>
        </div>
      );
    }
    
    switch (testimonialsData.display_style) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialsData.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow hover:shadow-md transition">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.company}
                        {testimonial.industry && `, ${testimonial.industry}`}
                      </p>
                    </div>
                    {testimonialsData.show_ratings && renderStarRating(testimonial.rating)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
        
      case 'list':
        return (
          <div className="space-y-6">
            {testimonialsData.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-l-4 border-primary bg-white shadow-sm">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.company}
                        {testimonial.industry && `, ${testimonial.industry}`}
                      </p>
                    </div>
                    {testimonialsData.show_ratings && renderStarRating(testimonial.rating)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
        
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonialsData.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.company}
                        {testimonial.industry && `, ${testimonial.industry}`}
                      </p>
                    </div>
                    {testimonialsData.show_ratings && renderStarRating(testimonial.rating)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
        
      // Carousel could be enhanced with a carousel component library
      case 'carousel':
      default:
        return (
          <div className="space-y-6">
            {testimonialsData.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-sm max-w-3xl mx-auto">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4 text-center text-lg">{testimonial.quote}</p>
                  <div className="flex justify-center items-center flex-col">
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.company}
                      {testimonial.industry && `, ${testimonial.industry}`}
                    </p>
                    {testimonialsData.show_ratings && (
                      <div className="mt-2">
                        {renderStarRating(testimonial.rating)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{business?.core?.businessName ? `Testimonials | ${business.core.businessName}` : 'Testimonials | Progress Accountants'}</title>
        <meta name="description" content="See what our clients say about working with us." />
      </Helmet>
      
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Client Testimonials</h1>
        
        {testimonialsData.intro && (
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            {testimonialsData.intro}
          </p>
        )}
        
        {renderTestimonials()}
      </div>
    </div>
  );
}