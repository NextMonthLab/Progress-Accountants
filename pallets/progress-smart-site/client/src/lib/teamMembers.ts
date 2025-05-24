import { 
  leePlaceholder, 
  henryPlaceholder, 
  jackiePlaceholder, 
  joyPlaceholder, 
  mannyPlaceholder 
} from '@/assets/teamPlaceholders';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  qualifications?: string;
  biography: string;
  interests: string;
  photoUrl?: string;
  placeholderComponent?: () => JSX.Element;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Lee Rogers",
    qualifications: "FMAAT",
    role: "Lead Accountant",
    biography: "Over a decade in accounting; leads the firm with a focus on leveraging technology for optimal client service.",
    interests: "Enjoys swimming with his children, running, and staying updated with the latest tech.",
    placeholderComponent: leePlaceholder,
    socialLinks: {
      linkedin: "https://linkedin.com/in/leerogers",
      email: "lee@progressaccountants.com"
    }
  },
  {
    id: 2,
    name: "Henry Simons",
    qualifications: "MAAT",
    role: "Manager",
    biography: "Joined in October 2024 with nearly ten years of experience; passionate about contributing to business growth.",
    interests: "An underground music DJ, hosts a radio show on Sigil Radio, and supports Birmingham City FC.",
    placeholderComponent: henryPlaceholder,
    socialLinks: {
      linkedin: "https://linkedin.com/in/henrysimons",
      twitter: "https://twitter.com/henrysimonsacco"
    }
  },
  {
    id: 3,
    name: "Jackie Bosch",
    role: "Assistant Accountant",
    biography: "Brings over 30 years of experience; known for her attention to detail and client-first approach.",
    interests: "Loves family time, long walks in Oxfordshire, and planning travel adventures.",
    placeholderComponent: jackiePlaceholder,
    socialLinks: {
      email: "jackie@progressaccountants.com"
    }
  },
  {
    id: 4,
    name: "Joy Holloway",
    role: "Business Administrator",
    biography: "Supports accounting and bookkeeping teams; ensures excellent customer service.",
    interests: "Enjoys time with her family and her dog, Fred; fan of Italian food and the movie Dirty Dancing.",
    placeholderComponent: joyPlaceholder,
    socialLinks: {
      linkedin: "https://linkedin.com/in/joyholloway"
    }
  },
  {
    id: 5,
    name: "Manny Abayomi",
    role: "Digital Marketing Executive",
    biography: "Manages social media, website, email marketing, and branding efforts.",
    interests: "Enjoys gym workouts and plays as a defender for his local football team.",
    placeholderComponent: mannyPlaceholder,
    socialLinks: {
      linkedin: "https://linkedin.com/in/mannyabayomi",
      twitter: "https://twitter.com/mannydigital"
    }
  }
];