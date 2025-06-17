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
    name: "Gareth Burton",
    qualifications: "FCA",
    role: "Founder & CEO",
    biography: "Having built an award-winning pension audit and assurance practice, Gareth launched Progress Accountants in 2017. With over 25 years of experience as an accountant and over a decade as a business owner, Gareth understands the pain business owners experience when setting up and growing their businesses. From this experience, Gareth is keen to help clients avoid the pain points he faced by supporting them with an efficient and dynamic, tech-led firm that provides clients with detailed record-keeping, daily bookkeeping and forward-looking financial information and insight.",
    interests: "Gareth enjoys watching football, travelling, spending time with family and friends, and walking his dog around the Oxfordshire countryside.",
    socialLinks: {
      email: "gareth@progressaccountants.com"
    }
  },
  {
    id: 2,
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
    id: 3,
    name: "Henry Simons",
    qualifications: "MAAT",
    role: "Manager",
    biography: "Henry joined in 2024, bringing nearly 10 years of practice experience and a deep commitment to strategic business growth. He leads operations and supports clients across key sectors, including construction and media.",
    interests: "An underground music DJ, hosts a radio show on Sigil Radio, and supports Birmingham City FC.",
    photoUrl: "https://res.cloudinary.com/drl0fxrkq/image/upload/v1749198731/Screenshot_2025-06-06_at_09.31.48_dr07tk.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/henrysimons",
      twitter: "https://twitter.com/henrysimonsacco"
    }
  },
  {
    id: 4,
    name: "Jackie Bosch",
    role: "Assistant Accountant",
    biography: "With more than 30 years of experience, Jackie is known for her attention to detail, reliability, and calm professionalism. She plays a vital role in supporting our SME clients with day-to-day bookkeeping and compliance.",
    interests: "Loves family time, long walks in Oxfordshire, and planning travel adventures.",
    photoUrl: "https://res.cloudinary.com/drl0fxrkq/image/upload/v1749198731/Screenshot_2025-06-06_at_08.58.48_qrjfxz.png",
    socialLinks: {
      email: "jackie@progressaccountants.com"
    }
  },
  {
    id: 5,
    name: "Joy Holloway",
    role: "Business Administrator",
    biography: "Joy ensures every client interaction is smooth, professional, and human. From document handling to scheduling, she's the behind-the-scenes engine keeping your accounting experience stress-free.",
    interests: "Enjoys time with her family and her dog, Fred; fan of Italian food and the movie Dirty Dancing.",
    photoUrl: "https://res.cloudinary.com/drl0fxrkq/image/upload/v1749198731/Screenshot_2025-06-06_at_09.29.31_xvd7b2.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/joyholloway"
    }
  },
  {
    id: 6,
    name: "Becky Rogers",
    role: "Assistant Accountant",
    biography: "Becky is an Assistant Accountant at Progress Accountants, supporting a wide variety of clients with care, professionalism, and precision. With a background in finance and a keen eye for detail, Becky plays a key role in ensuring clients stay on track with their bookkeeping, tax, and compliance needs. Her friendly, proactive approach makes her a valued part of the Progress team—someone clients know they can count on for clear communication and dependable support.",
    interests: "",
    socialLinks: {
      email: "becky@progressaccountants.com"
    }
  },
  {
    id: 7,
    name: "Manny Abayomi",
    role: "Digital Marketing Executive",
    biography: "Manny leads our digital presence—managing campaigns, brand messaging, and online outreach. He helps keep Progress visible, relevant, and connected to clients across the UK.",
    interests: "Enjoys gym workouts and plays as a defender for his local football team.",
    photoUrl: "https://res.cloudinary.com/drl0fxrkq/image/upload/v1749198731/Screenshot_2025-06-06_at_09.30.24_qahuzv.png",
    socialLinks: {
      linkedin: "https://linkedin.com/in/mannyabayomi",
      twitter: "https://twitter.com/mannydigital"
    }
  }
];