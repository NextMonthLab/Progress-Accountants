// Frontend-only API client for Progress Accountants
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for standalone frontend operation
export const mockData = {
  tenant: {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Progress Accountants',
  },
  businessIdentity: {
    core: {
      businessName: 'Progress Accountants',
      tagline: 'Expert accounting services in Banbury',
      description: 'Professional accounting and business advisory services',
    },
  },
  pages: [
    '/',
    '/about',
    '/services',
    '/team',
    '/contact',
    '/testimonials',
    '/resources',
    '/sme-support-hub',
    '/business-calculator',
    '/industries/film',
    '/industries/music',
    '/industries/construction',
    '/industries/professional-services',
    '/client-dashboard',
  ],
};

// API request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error:', error.message);
    // Return mock data for development/standalone mode
    if (error.config?.url?.includes('/pages/public')) {
      return { data: mockData.pages };
    }
    if (error.config?.url?.includes('/tenant/')) {
      return { data: mockData.tenant };
    }
    if (error.config?.url?.includes('/business-identity')) {
      return { data: mockData.businessIdentity };
    }
    return Promise.reject(error);
  }
);

export default api;