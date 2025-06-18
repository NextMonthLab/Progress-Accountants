export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  qualifications?: string[];
  email?: string;
  phone?: string;
  specializations?: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: "gareth-burton",
    name: "Gareth Burton FCA",
    position: "Founder & CEO",
    bio: "Gareth is a Fellow of the Institute of Chartered Accountants in England and Wales (FCA) with over 15 years of experience in accounting and business advisory services. After qualifying with a top 10 accounting firm in London, Gareth gained extensive experience in corporate finance, audit, and tax planning before establishing Progress Accountants in 2018. His expertise spans across multiple industries including film, music, construction, and professional services. Gareth is passionate about helping businesses achieve sustainable growth through strategic financial planning and innovative accounting solutions. He holds regular training sessions for SMEs and frequently speaks at business development seminars throughout Oxfordshire.",
    image: "/team/gareth-burton.jpg",
    qualifications: ["FCA - Fellow of the Institute of Chartered Accountants", "Advanced Certificate in Tax Planning", "Corporate Finance Qualification"],
    email: "gareth@progressaccountants.co.uk",
    specializations: ["Corporate Finance", "Tax Planning", "Business Advisory", "SME Growth Strategies"]
  },
  {
    id: "becky-rogers",
    name: "Becky Rogers",
    position: "Assistant Accountant",
    bio: "Becky brings a fresh perspective and exceptional attention to detail to the Progress Accountants team. Currently studying towards her AAT qualification while gaining practical experience, she specializes in bookkeeping, VAT returns, and client support services. Becky's background in customer service excellence ensures our clients receive outstanding support throughout their financial journey. She is particularly skilled at helping new businesses set up their accounting systems and provides ongoing support for day-to-day financial operations. Her approachable manner and thorough understanding of modern accounting software makes her an invaluable resource for our SME clients.",
    image: "/team/becky-rogers.jpg",
    qualifications: ["AAT Level 3 (in progress)", "Customer Service Excellence Certification"],
    email: "becky@progressaccountants.co.uk",
    specializations: ["Bookkeeping", "VAT Returns", "Client Support", "Software Training"]
  }
];

export const getTeamMember = (id: string): TeamMember | undefined => {
  return teamMembers.find(member => member.id === id);
};