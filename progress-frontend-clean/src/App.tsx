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
import ProfessionalServicesPage from "@/pages/ProfessionalServicesPage";

// Legal Pages - removed for static deployment

// Other Pages
import WhyUsPage from "@/pages/WhyUsPage";

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
          <Route path="/construction">
            <div className="min-h-screen bg-background p-8">
              <h1 className="text-4xl font-bold mb-4">Construction Industry</h1>
              <p>Expert accounting services for construction businesses.</p>
            </div>
          </Route>
          <Route path="/industries/construction">
            <div className="min-h-screen bg-background p-8">
              <h1 className="text-4xl font-bold mb-4">Construction Industry</h1>
              <p>Expert accounting services for construction businesses.</p>
            </div>
          </Route>
          <Route path="/professional-services" component={ProfessionalServicesPage} />
          <Route path="/industries/professional-services" component={ProfessionalServicesPage} />

          {/* Service Detail Placeholder */}
          <Route path="/services/:slug">
            <div className="min-h-screen bg-background p-8">
              <h1 className="text-4xl font-bold mb-4">Service Details</h1>
              <p>Detailed service information would be loaded here.</p>
            </div>
          </Route>

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