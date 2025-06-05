import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function BlogPage() {
  const [, setLocation] = useLocation();

  // Redirect to admin blog generator page
  useEffect(() => {
    setLocation('/admin/content/blog-posts');
  }, [setLocation]);

  return null;
}