import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32 space-y-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Skeleton className="h-8 w-3/4 max-w-md" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-6 w-5/6 max-w-2xl" />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature section skeleton
export function FeaturesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full py-12 md:py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-7 w-3/4 max-w-md mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 p-6 rounded-lg border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Testimonial skeleton
export function TestimonialsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full py-12 md:py-20 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-7 w-1/2 max-w-md mx-auto mb-4" />
          <Skeleton className="h-5 w-3/4 max-w-lg mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex flex-col p-6 bg-background rounded-lg border shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Call to action skeleton
export function CtaSkeleton() {
  return (
    <div className="w-full py-12 md:py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto p-8 rounded-lg border bg-background">
          <Skeleton className="h-7 w-3/4 max-w-md" />
          <Skeleton className="h-5 w-full max-w-lg" />
          <Skeleton className="h-10 w-40 mt-4" />
        </div>
      </div>
    </div>
  );
}

// Team member skeleton
export function TeamMemberSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-3">
          <Skeleton className="h-40 w-40 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

// Contact form skeleton
export function ContactFormSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Skeleton className="h-6 w-1/2 mb-6" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-10 w-1/3" />
    </div>
  );
}

// Card skeleton
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-background p-6 shadow-sm">
          <Skeleton className="h-40 w-full rounded-md mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-9 w-1/3" />
        </div>
      ))}
    </div>
  );
}

// Page header skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="w-full py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
      </div>
    </div>
  );
}

// Services list skeleton
export function ServicesSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col p-6 bg-background rounded-lg border shadow-sm">
          <Skeleton className="h-12 w-12 rounded-md mb-4" />
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-8 w-24 mt-auto" />
        </div>
      ))}
    </div>
  );
}

// Logo cloud skeleton
export function LogoCloudSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="py-10">
      <div className="text-center mb-6">
        <Skeleton className="h-6 w-64 mx-auto" />
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-28" />
        ))}
      </div>
    </div>
  );
}

// Navigation skeleton
export function NavigationSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <Skeleton className="h-8 w-32" />
      <div className="flex space-x-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-18" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}

// Blog post skeleton
export function BlogPostSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-b pb-8 last:border-b-0">
          <Skeleton className="h-48 w-full rounded-lg mb-4" />
          <Skeleton className="h-7 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats section skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="text-center">
          <Skeleton className="h-12 w-20 mx-auto mb-2" />
          <Skeleton className="h-5 w-32 mx-auto" />
        </div>
      ))}
    </div>
  );
}