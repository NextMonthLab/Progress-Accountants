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
    biography: "Lee has spent over a decade helping SMEs navigate tax, growth, and compliance. As our lead accountant, he champions the use of modern accounting tech to deliver a proactive client experience.",
    interests: "Enjoys swimming with his children, running, and staying updated with the latest tech.",
    photoUrl: "https://res.cloudinary.com/drl0fxrkq/image/upload/v1749206791/IMG_9419_htet0f.jpg",
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
    biography: "Henry joined in 2024, bringing nearly 10 years of practice experience and a deep commitment to strategic business growth. He leads operations and supports clients across key sectors, including construction and media.",
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
    biography: "With more than 30 years of experience, Jackie is known for her attention to detail, reliability, and calm professionalism. She plays a vital role in supporting our SME clients with day-to-day bookkeeping and compliance.",
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
    biography: "Joy ensures every client interaction is smooth, professional, and human. From document handling to scheduling, she's the behind-the-scenes engine keeping your accounting experience stress-free.",
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
    biography: "Manny leads our digital presence—managing campaigns, brand messaging, and online outreach. He helps keep Progress visible, relevant, and connected to clients across the UK.",
    interests: "Enjoys gym workouts and plays as a defender for his local football team.",
    placeholderComponent: mannyPlaceholder,
    socialLinks: {
      linkedin: "https://linkedin.com/in/mannyabayomi",
      twitter: "https://twitter.com/mannydigital"
    }
  }
];