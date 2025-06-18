import { Route, Switch } from 'wouter';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Import public pages only
import { ProgressHomePage } from '@/pages/ProgressHomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import TeamPage from '@/pages/TeamPage';
import ContactPage from '@/pages/ContactPage';
import BusinessCalculatorPage from '@/pages/BusinessCalculatorPage';
import NewsPage from '@/pages/NewsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import SMESupportHubPage from '@/pages/SMESupportHubPage';
import StudioBanburyPage from '@/pages/StudioBanburyPage';
import FilmIndustryPage from '@/pages/FilmIndustryPage';
import MusicIndustryPage from '@/pages/MusicIndustryPage';
import ConstructionIndustryPage from '@/pages/ConstructionIndustryPage';
import ProfessionalServicesPage from '@/pages/ProfessionalServicesPage';
import WhyUsPage from '@/pages/WhyUsPage';
import ClientDashboardPage from '@/pages/ClientDashboardPage';

function App() {
  useEffect(() => {
    // Set proper CSS variables for dark theme
    const root = document.documentElement;
    root.style.setProperty('--background', '240 10% 3.9%');
    root.style.setProperty('--foreground', '0 0% 98%');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Progress Accountants</title>
        <meta name="description" content="Professional accounting services" />
      </Helmet>
      <Toaster richColors position="top-right" />
      
      <Switch>
        <Route path="/" component={ProgressHomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/team" component={TeamPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/business-calculator" component={BusinessCalculatorPage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/sme-support-hub" component={SMESupportHubPage} />
        <Route path="/studio-banbury" component={StudioBanburyPage} />
        <Route path="/industries/film" component={FilmIndustryPage} />
        <Route path="/industries/music" component={MusicIndustryPage} />
        <Route path="/industries/construction" component={ConstructionIndustryPage} />
        <Route path="/industries/professional-services" component={ProfessionalServicesPage} />
        <Route path="/why-us" component={WhyUsPage} />
        <Route path="/client-dashboard" component={ClientDashboardPage} />
        
        {/* Default fallback */}
        <Route component={ProgressHomePage} />
      </Switch>
    </div>
  );
}

export default App;