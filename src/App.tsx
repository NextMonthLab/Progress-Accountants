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

// Core pages only - industry and service pages available via direct navigation
import WhyUsPage from "@/pages/WhyUsPage";

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