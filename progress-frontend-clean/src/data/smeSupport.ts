export interface Organization {
  name: string;
  website: string;
  generalPhone?: string;
  specialistPhones?: { label: string; number: string }[];
  email?: string;
  textphone?: string;
  hours?: string;
  description: string;
}

export interface Deadline {
  date: string;
  description: string;
}

export const organizations: Organization[] = [
  {
    name: "HM Revenue & Customs (HMRC)",
    website: "https://www.gov.uk/contact-hmrc",
    specialistPhones: [
      { label: "General Enquiries", number: "0300 200 3300" },
      { label: "Self Assessment", number: "0300 200 3310" },
      { label: "VAT", number: "0300 200 3700" },
      { label: "CIS (Construction Industry Scheme)", number: "0300 200 3210" }
    ],
    hours: "Mon–Fri 8am–8pm, Sat 8am–4pm",
    description: "The UK's tax authority for Self Assessment, PAYE, VAT, and business support services."
  },
  {
    name: "Companies House",
    website: "https://www.gov.uk/contact-companies-house",
    generalPhone: "0303 1234 500",
    email: "enquiries@companieshouse.gov.uk",
    hours: "Mon–Fri 8:30am–6pm",
    description: "The registrar of companies in the UK, responsible for incorporation, annual filings, and compliance updates."
  },
  {
    name: "Small Business Commissioner",
    website: "https://www.smallbusinesscommissioner.gov.uk",
    generalPhone: "0121 695 7770",
    email: "enquiries@smallbusinesscommissioner.gov.uk",
    hours: "Mon–Fri 9am–5pm",
    description: "A government body that helps small businesses deal with late payments and dispute resolution with larger firms."
  },
  {
    name: "Federation of Small Businesses (FSB)",
    website: "https://www.fsb.org.uk",
    generalPhone: "0808 20 20 888",
    email: "customerservices@fsb.org.uk",
    hours: "Mon–Fri 9am–5pm",
    description: "A national membership organisation offering legal support, business banking, and advocacy for small businesses."
  },
  {
    name: "British Business Bank",
    website: "https://www.british-business-bank.co.uk",
    generalPhone: "0114 206 2131 / 0203 772 1340",
    description: "A government-owned bank that helps small businesses access finance, funding, and growth support."
  },
  {
    name: "Information Commissioner's Office (ICO)",
    website: "https://ico.org.uk",
    generalPhone: "0303 123 1113",
    textphone: "18001 0303 123 1113",
    hours: "Mon–Fri 9am–5pm",
    description: "UK authority for data protection, privacy, and GDPR compliance."
  }
];

export const deadlines: Deadline[] = [
  {
    date: "31 Jan 2025",
    description: "Self Assessment tax return and payment due"
  },
  {
    date: "5 Apr 2025",
    description: "End of 2024/25 tax year"
  },
  {
    date: "6 Apr 2025",
    description: "Start of 2025/26 tax year"
  },
  {
    date: "31 May 2025",
    description: "Deadline for issuing P60s to employees"
  },
  {
    date: "6 Jul 2025",
    description: "Deadline for reporting expenses and benefits (P11D)"
  },
  {
    date: "19 Jul 2025",
    description: "Deadline for paying Class 1A National Insurance on benefits"
  },
  {
    date: "31 Oct 2025",
    description: "Paper Self Assessment tax return deadline"
  }
];

export const filters = [
  "All",
  "Tax",
  "Compliance",
  "Finance Access",
  "Support",
  "Data Protection"
];