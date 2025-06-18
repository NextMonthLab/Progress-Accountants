// Static frontend schema definitions
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface BusinessIdentity {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}