import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { DocumentHead } from "@/components/DocumentHead";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/error/ErrorBoundary";

// Public pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import TeamPage from "@/pages/TeamPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/not-found";

// Industry pages
import FilmPage from "@/pages/industries/FilmPage";
import MusicPage from "@/pages/industries/MusicPage";
import ConstructionPage from "@/pages/industries/ConstructionPage";
import ProfessionalServicesPage from "@/pages/industries/ProfessionalServicesPage";

// Service pages
import BusinessCalculatorPage from "@/pages/services/BusinessCalculatorPage";
import StudioBanburyPage from "@/pages/services/StudioBanburyPage";
import WhyUsPage from "@/pages/WhyUsPage";
import SMESupportHubPage from "@/pages/services/SMESupportHubPage";
import NewsPage from "@/pages/NewsPage";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DocumentHead />
        <div className="min-h-screen bg-black">
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/team" component={TeamPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/why-us" component={WhyUsPage} />
            <Route path="/news" component={NewsPage} />
            
            {/* Industry Routes */}
            <Route path="/industries/film" component={FilmPage} />
            <Route path="/industries/music" component={MusicPage} />
            <Route path="/industries/construction" component={ConstructionPage} />
            <Route path="/industries/professional-services" component={ProfessionalServicesPage} />
            
            {/* Service Routes */}
            <Route path="/services/business-calculator" component={BusinessCalculatorPage} />
            <Route path="/services/studio-banbury" component={StudioBanburyPage} />
            <Route path="/services/sme-support-hub" component={SMESupportHubPage} />
            
            {/* 404 Route */}
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;