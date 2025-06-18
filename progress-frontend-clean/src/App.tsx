import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import EmbeddedChatbot from "@/components/EmbeddedChatbot";

// Public Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import TeamPage from "@/pages/TeamPage";
import ContactPage from "@/pages/ContactPage";
import ConstructionIndustryPage from "@/pages/ConstructionIndustryPage";
import FilmIndustryPage from "@/pages/FilmIndustryPage";
import MusicIndustryPage from "@/pages/MusicIndustryPage";
import ProfessionalServicesPage from "@/pages/ProfessionalServicesPage";
import SMESupportHubPage from "@/pages/SMESupportHubPage";
import StudioBanburyPage from "@/pages/StudioBanburyPage";

// Legal Pages
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import CookiePolicyPage from "@/pages/CookiePolicyPage";

// Other Pages
import WhyUsPage from "@/pages/WhyUsPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <EmbeddedChatbot />
        <Switch>
          {/* Main Pages */}
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/why-us" component={WhyUsPage} />

          {/* Industry Pages */}
          <Route path="/construction" component={ConstructionIndustryPage} />
          <Route path="/industries/construction" component={ConstructionIndustryPage} />
          <Route path="/film" component={FilmIndustryPage} />
          <Route path="/industries/film" component={FilmIndustryPage} />
          <Route path="/music" component={MusicIndustryPage} />
          <Route path="/industries/music" component={MusicIndustryPage} />
          <Route path="/professional-services" component={ProfessionalServicesPage} />
          <Route path="/industries/professional-services" component={ProfessionalServicesPage} />

          {/* Specialized Pages */}
          <Route path="/sme-support-hub" component={SMESupportHubPage} />
          <Route path="/studio-banbury" component={StudioBanburyPage} />
          <Route path="/services/:slug" component={ServiceDetailPage} />

          {/* Legal Pages */}
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/terms-of-service" component={TermsOfServicePage} />
          <Route path="/cookie-policy" component={CookiePolicyPage} />

          {/* 404 Fallback */}
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Return Home</a>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;