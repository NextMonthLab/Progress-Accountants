import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImagePlaceholder } from '../assets/imagePlaceholders';
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Import real images
import teamPhotoImage from "../assets/images/team_photo.jpg";
import strategySessionImage from "../assets/images/strategy_session.jpg";

// Placeholder data for financial dates
const financialDates = [
  { date: "2025-04-30", title: "VAT Return Deadline", category: "tax" },
  { date: "2025-05-19", title: "PAYE Payment Deadline", category: "payroll" },
  { date: "2025-06-01", title: "Corporation Tax Payment", category: "tax" },
  { date: "2025-07-31", title: "Self Assessment Payment", category: "tax" },
  { date: "2025-05-07", title: "P60 Deadline", category: "payroll" }
];

// Placeholder data for latest news
const latestNews = [
  {
    source: "HMRC",
    title: "New Digital Tax System Postponed Until 2026",
    date: "2025-04-10",
    summary: "HMRC has announced that the implementation of Making Tax Digital for Income Tax has been postponed until April 2026.",
    url: "#"
  },
  {
    source: "Companies House",
    title: "Changes to Filing Requirements Coming in May",
    date: "2025-04-05",
    summary: "Companies House announces new filing requirements for businesses starting from May 2025.",
    url: "#"
  },
  {
    source: "HMRC",
    title: "Updated Guidance on R&D Tax Credits",
    date: "2025-03-28",
    summary: "HMRC has released updated guidance on claiming Research and Development tax credits.",
    url: "#"
  },
  {
    source: "Companies House",
    title: "New Anti-Money Laundering Regulations",
    date: "2025-03-15",
    summary: "Companies House implements new verification procedures to combat money laundering.",
    url: "#"
  }
];

// Dashboard features
const dashboardFeatures = [
  {
    title: "Real-Time Financial Overview",
    description: "View your cash flow, profit & loss, and other essential metrics at a glance.",
    icon: "📊"
  },
  {
    title: "Integration with Accounting Software",
    description: "Seamlessly connect with Xero, QuickBooks, and more.",
    icon: "🔄"
  },
  {
    title: "Customized Alerts",
    description: "Receive notifications for upcoming tax deadlines and financial obligations.",
    icon: "🔔"
  },
  {
    title: "Latest News Feed",
    description: "Stay informed with real-time updates from HMRC and Companies House.",
    icon: "📰"
  },
  {
    title: "Studio Booking",
    description: "Easily schedule sessions in our podcast and video studio.",
    icon: "🎙️"
  }
];

export default function DashboardPage() {
  // Animation setup
  const sectionRefs = {
    hero: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    news: useRef<HTMLElement>(null),
    dates: useRef<HTMLElement>(null),
    studio: useRef<HTMLElement>(null),
    support: useRef<HTMLElement>(null)
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Placeholder for selected date in calendar
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Format dates for display in calendar
  const highlightedDates = financialDates.map(item => new Date(item.date));

  return (
    <>
      {/* Hero Section */}
      <section 
        ref={sectionRefs.hero}
        className="py-16 md:py-24 fade-in-section" 
        style={{ backgroundColor: 'var(--navy)' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 text-white">
              <h1 className="font-poppins font-bold text-3xl md:text-5xl mb-4">
                Your Business Finances, Simplified
              </h1>
              <h2 className="font-poppins text-xl md:text-2xl mb-6 text-gray-200">
                A dashboard designed for you – not your accountant.
              </h2>
              <p className="text-lg mb-8 text-gray-300">
                Tired of navigating complex accounting software? Our Financial Dashboard presents your key financial metrics in a clear, concise manner.
              </p>
              <Button 
                size="lg" 
                style={{ backgroundColor: 'var(--orange)' }}
                className="px-8 py-6 text-lg glow-on-hover hover:-translate-y-[2px] transition duration-300"
              >
                Access Your Dashboard
              </Button>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-700">
                <img 
                  src={teamPhotoImage} 
                  alt="Progress Accountants Team"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Features Section */}
      <section 
        ref={sectionRefs.features}
        id="features" 
        className="py-16 md:py-24 bg-white fade-in-section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 
              className="font-poppins font-bold text-2xl md:text-3xl mb-6"
              style={{ color: 'var(--navy)' }}
            >
              Key Features
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="hover-scale transition duration-300 shadow-md overflow-hidden"
              >
                <CardContent className="p-6 flex flex-col items-center text-center pt-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 
                    className="font-poppins font-semibold text-lg mb-2"
                    style={{ color: 'var(--navy)' }}
                  >
                    {feature.title}
                  </h4>
                  <p style={{ color: 'var(--dark-grey)' }}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Updates Section */}
      <section 
        ref={sectionRefs.news}
        id="news" 
        className="py-16 md:py-24 fade-in-section"
        style={{ backgroundColor: 'var(--light-grey)' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 
              className="font-poppins font-bold text-2xl md:text-3xl mb-4"
              style={{ color: 'var(--navy)' }}
            >
              Stay Informed
            </h3>
            <p className="text-lg" style={{ color: 'var(--dark-grey)' }}>
              Get the latest updates from HMRC and Companies House
            </p>
          </div>
          
          <Tabs defaultValue="all" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all">All Updates</TabsTrigger>
              <TabsTrigger value="hmrc">HMRC</TabsTrigger>
              <TabsTrigger value="companies">Companies House</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-6">
                {latestNews.map((news, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant={news.source === "HMRC" ? "default" : "outline"} 
                          style={news.source === "HMRC" ? {backgroundColor: 'var(--navy)'} : {}}>
                          {news.source}
                        </Badge>
                        <span className="text-sm text-gray-500">{news.date}</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--navy)' }}>
                        {news.title}
                      </h4>
                      <p className="mb-4" style={{ color: 'var(--dark-grey)' }}>
                        {news.summary}
                      </p>
                      <a href={news.url} className="text-sm font-medium" style={{ color: 'var(--orange)' }}>
                        Read more →
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="hmrc">
              <div className="space-y-6">
                {latestNews.filter(news => news.source === "HMRC").map((news, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="default" style={{backgroundColor: 'var(--navy)'}}>
                          {news.source}
                        </Badge>
                        <span className="text-sm text-gray-500">{news.date}</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--navy)' }}>
                        {news.title}
                      </h4>
                      <p className="mb-4" style={{ color: 'var(--dark-grey)' }}>
                        {news.summary}
                      </p>
                      <a href={news.url} className="text-sm font-medium" style={{ color: 'var(--orange)' }}>
                        Read more →
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="companies">
              <div className="space-y-6">
                {latestNews.filter(news => news.source === "Companies House").map((news, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline">
                          {news.source}
                        </Badge>
                        <span className="text-sm text-gray-500">{news.date}</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--navy)' }}>
                        {news.title}
                      </h4>
                      <p className="mb-4" style={{ color: 'var(--dark-grey)' }}>
                        {news.summary}
                      </p>
                      <a href={news.url} className="text-sm font-medium" style={{ color: 'var(--orange)' }}>
                        Read more →
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Key Financial Dates Section */}
      <section 
        ref={sectionRefs.dates}
        id="dates" 
        className="py-16 md:py-24 bg-white fade-in-section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 
              className="font-poppins font-bold text-2xl md:text-3xl mb-4"
              style={{ color: 'var(--navy)' }}
            >
              Important Dates
            </h3>
            <p className="text-lg" style={{ color: 'var(--dark-grey)' }}>
              Never miss a tax deadline again
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  modifiers={{
                    highlighted: highlightedDates
                  }}
                  modifiersStyles={{
                    highlighted: {
                      backgroundColor: 'var(--orange)',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>
              <div className="text-center">
                <Button className="mt-4" variant="outline">
                  Sync with Your Calendar
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-4" style={{ color: 'var(--navy)' }}>
                    Upcoming Deadlines
                  </h4>
                  <div className="space-y-4">
                    {financialDates.map((item, index) => (
                      <div key={index} className="flex items-start pb-4 border-b last:border-0 border-gray-100">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-md flex flex-col items-center justify-center mr-4">
                          <span className="font-bold text-lg" style={{ color: 'var(--navy)' }}>
                            {new Date(item.date).getDate()}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(item.date).toLocaleString('default', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium text-md" style={{ color: 'var(--navy)' }}>
                            {item.title}
                          </h5>
                          <Badge variant={item.category === "tax" ? "default" : "outline"} 
                            style={item.category === "tax" ? {backgroundColor: 'var(--orange)'} : {}}>
                            {item.category === "tax" ? "Tax" : "Payroll"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Booking Section */}
      <section 
        ref={sectionRefs.studio}
        id="studio" 
        className="py-16 md:py-24 fade-in-section"
        style={{ backgroundColor: 'var(--light-grey)' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={strategySessionImage} 
                  alt="Strategy Session with Financial Advisors"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 
                className="font-poppins font-bold text-2xl md:text-3xl mb-4"
                style={{ color: 'var(--navy)' }}
              >
                Book Our Studio
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--dark-grey)' }}>
                As a Progress client, you get free access to our professional podcast and video studio. Schedule your session directly through your dashboard.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h4 className="font-semibold mb-2" style={{ color: 'var(--navy)' }}>Available Equipment:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="mr-2 text-orange-500">✓</span> Professional cameras with interchangeable lenses
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-orange-500">✓</span> Broadcast-quality microphones
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-orange-500">✓</span> Professional lighting setup
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-orange-500">✓</span> Acoustically treated space
                  </li>
                </ul>
              </div>
              <a href="/studio-banbury">
                <Button 
                  style={{ backgroundColor: 'var(--orange)' }}
                  className="px-6 py-4 text-lg glow-on-hover hover:-translate-y-[2px] transition duration-300"
                >
                  Schedule a Session
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Assistance Section */}
      <section 
        ref={sectionRefs.support}
        id="support" 
        className="py-16 md:py-24 bg-white fade-in-section"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 
              className="font-poppins font-bold text-2xl md:text-3xl mb-4"
              style={{ color: 'var(--navy)' }}
            >
              Need Help?
            </h3>
            <p className="text-lg mb-8" style={{ color: 'var(--dark-grey)' }}>
              Access our support resources or contact your dedicated accountant for assistance.
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
              <Card className="hover-scale transition duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">📞</span>
                  </div>
                  <h4 className="font-medium mb-2">Call Us</h4>
                  <p className="text-gray-600">01295 123456</p>
                </CardContent>
              </Card>
              <Card className="hover-scale transition duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h4 className="font-medium mb-2">Email Us</h4>
                  <p className="text-gray-600">support@progressaccts.co.uk</p>
                </CardContent>
              </Card>
            </div>
            <Button 
              style={{ backgroundColor: 'var(--navy)' }}
              className="px-8 py-6 text-lg"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}