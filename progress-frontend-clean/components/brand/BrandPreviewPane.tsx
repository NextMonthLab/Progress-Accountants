import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandVersion } from './BrandVersionList';

interface BrandPreviewPaneProps {
  isOpen: boolean;
  onClose: () => void;
  version: BrandVersion;
}

export function BrandPreviewPane({ isOpen, onClose, version }: BrandPreviewPaneProps) {
  const [activeTab, setActiveTab] = useState("components");

  // Typography values with fallbacks
  const primaryFont = version.typography?.primaryFont || "Inter, sans-serif";
  const secondaryFont = version.typography?.secondaryFont || "Georgia, serif";
  const headingFontWeight = version.typography?.headingSettings?.fontWeight || "bold";
  const headingLetterSpacing = version.typography?.headingSettings?.letterSpacing || "-0.025em";
  
  // Color values with fallbacks
  const primaryColor = version.primaryColor || "#003366"; // Navy blue default
  const secondaryColor = version.secondaryColor || "#E65C00"; // Burnt orange default
  const accentColor = version.accentColor || "#4A90E2"; // Blue accent

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Brand Preview: {version.versionName || version.versionNumber}</DialogTitle>
          <DialogDescription>
            Preview how this brand version will look across the site
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="homepage">Page Example</TabsTrigger>
          </TabsList>
          
          {/* Components Tab */}
          <TabsContent value="components" className="py-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="shadow-sm"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    Primary Button
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="shadow-sm"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    Outline Button
                  </Button>
                  
                  <Button
                    className="shadow-sm"
                    style={{ backgroundColor: secondaryColor, color: 'white' }}
                  >
                    Secondary Button
                  </Button>
                  
                  <Button
                    className="shadow-sm"
                    style={{ backgroundColor: accentColor, color: 'white' }}
                  >
                    Accent Button
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Cards</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-lg shadow-md"
                    style={{ borderColor: primaryColor, borderWidth: '1px' }}
                  >
                    <h4 style={{ 
                      color: primaryColor, 
                      fontFamily: secondaryFont,
                      fontWeight: headingFontWeight as any,
                      letterSpacing: headingLetterSpacing,
                      fontSize: '1.25rem',
                      marginBottom: '0.5rem'
                    }}>
                      Card Title
                    </h4>
                    <p style={{ fontFamily: primaryFont }}>
                      This is some sample text that would appear in a card component using the primary font.
                    </p>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        style={{ backgroundColor: primaryColor, color: 'white' }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg shadow-md"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                  >
                    <h4 style={{ 
                      fontFamily: secondaryFont,
                      fontWeight: headingFontWeight as any,
                      letterSpacing: headingLetterSpacing,
                      fontSize: '1.25rem',
                      marginBottom: '0.5rem'
                    }}>
                      Inverted Card
                    </h4>
                    <p style={{ fontFamily: primaryFont }}>
                      This is an inverted card with white text on the primary color background.
                    </p>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white"
                        style={{ borderColor: 'white', color: primaryColor }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Navigation</h3>
                <div 
                  className="p-4 flex items-center justify-between rounded-lg shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="text-white font-bold text-xl">
                    {version.logoUrl ? (
                      <img 
                        src={version.logoUrl} 
                        alt="Logo" 
                        className="h-8"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x40/ffffff/003366?text=LOGO';
                        }}
                      />
                    ) : (
                      "Progress Accountants"
                    )}
                  </div>
                  
                  <div className="flex gap-4 text-white">
                    <div>Home</div>
                    <div>Services</div>
                    <div>About</div>
                    <div>Contact</div>
                    <Button
                      size="sm"
                      style={{ backgroundColor: secondaryColor, color: 'white' }}
                    >
                      Client Portal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Typography Tab */}
          <TabsContent value="typography" className="py-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Headings</h3>
                <div className="p-4 border rounded-lg">
                  <h1 style={{
                    fontFamily: secondaryFont,
                    fontWeight: headingFontWeight as any,
                    letterSpacing: headingLetterSpacing,
                    fontSize: '2.5rem',
                    color: primaryColor,
                    marginBottom: '0.5rem'
                  }}>
                    Heading 1
                  </h1>
                  <h2 style={{
                    fontFamily: secondaryFont,
                    fontWeight: headingFontWeight as any,
                    letterSpacing: headingLetterSpacing,
                    fontSize: '2rem',
                    color: primaryColor,
                    marginBottom: '0.5rem'
                  }}>
                    Heading 2
                  </h2>
                  <h3 style={{
                    fontFamily: secondaryFont,
                    fontWeight: headingFontWeight as any,
                    letterSpacing: headingLetterSpacing,
                    fontSize: '1.75rem',
                    color: primaryColor,
                    marginBottom: '0.5rem'
                  }}>
                    Heading 3
                  </h3>
                  <h4 style={{
                    fontFamily: secondaryFont,
                    fontWeight: headingFontWeight as any,
                    letterSpacing: headingLetterSpacing,
                    fontSize: '1.5rem',
                    color: primaryColor,
                    marginBottom: '0.5rem'
                  }}>
                    Heading 4
                  </h4>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Body Text</h3>
                <div className="p-4 border rounded-lg">
                  <p style={{
                    fontFamily: primaryFont,
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                  }}>
                    This is a paragraph of body text using the primary font. Progress Accountants offers a comprehensive suite of accounting and financial services designed to help businesses grow with confidence. Our team of experienced professionals uses cutting-edge technology to deliver accurate, timely, and actionable financial insights.
                  </p>
                  
                  <p style={{
                    fontFamily: primaryFont,
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                  }}>
                    We believe in <span style={{ color: accentColor, fontWeight: 'bold' }}>transparent accounting</span> that empowers our clients to make informed decisions. Whether you're a startup looking to establish financial processes or an established business seeking to optimize your financial operations, we have the expertise to support your goals.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Color Palette</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div 
                      className="h-20 rounded-t-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Primary Color
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-2 text-center">
                      {primaryColor}
                    </div>
                  </div>
                  
                  <div>
                    <div 
                      className="h-20 rounded-t-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      Secondary Color
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-2 text-center">
                      {secondaryColor}
                    </div>
                  </div>
                  
                  <div>
                    <div 
                      className="h-20 rounded-t-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: accentColor }}
                    >
                      Accent Color
                    </div>
                    <div className="border border-t-0 rounded-b-lg p-2 text-center">
                      {accentColor}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Homepage Example Tab */}
          <TabsContent value="homepage" className="py-4">
            <div className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div 
                className="p-4 flex items-center justify-between"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="text-white font-bold text-xl">
                  {version.logoUrl ? (
                    <img 
                      src={version.logoUrl} 
                      alt="Logo" 
                      className="h-8"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x40/ffffff/003366?text=LOGO';
                      }}
                    />
                  ) : (
                    "Progress Accountants"
                  )}
                </div>
                
                <div className="flex gap-4 text-white">
                  <div>Home</div>
                  <div>Services</div>
                  <div>About</div>
                  <div>Contact</div>
                  <Button
                    size="sm"
                    style={{ backgroundColor: secondaryColor, color: 'white' }}
                  >
                    Client Portal
                  </Button>
                </div>
              </div>
              
              {/* Hero Section */}
              <div 
                className="py-16 px-8 text-center"
                style={{ 
                  backgroundColor: '#f8f9fa',
                  borderBottom: `4px solid ${primaryColor}`
                }}
              >
                <h1 style={{
                  fontFamily: secondaryFont,
                  fontWeight: headingFontWeight as any,
                  letterSpacing: headingLetterSpacing,
                  fontSize: '2.5rem',
                  color: primaryColor,
                  marginBottom: '1rem'
                }}>
                  Modern Accounting for Growing Businesses
                </h1>
                <p style={{
                  fontFamily: primaryFont,
                  fontSize: '1.25rem',
                  maxWidth: '800px',
                  margin: '0 auto 1.5rem',
                  color: '#4a5568'
                }}>
                  Transparent, technology-driven financial services that help your business thrive
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    className="px-6 py-5 text-lg"
                    style={{ backgroundColor: secondaryColor, color: 'white' }}
                  >
                    Book a Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6 py-5 text-lg"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    Our Services
                  </Button>
                </div>
              </div>
              
              {/* Services Section */}
              <div className="py-12 px-8">
                <h2 style={{
                  fontFamily: secondaryFont,
                  fontWeight: headingFontWeight as any,
                  letterSpacing: headingLetterSpacing,
                  fontSize: '2rem',
                  color: primaryColor,
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  Our Services
                </h2>
                
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="p-6 rounded-lg shadow-md"
                      style={{
                        borderTop: `4px solid ${i === 1 ? primaryColor : i === 2 ? secondaryColor : accentColor}`
                      }}
                    >
                      <h3 style={{
                        fontFamily: secondaryFont,
                        fontWeight: headingFontWeight as any,
                        letterSpacing: headingLetterSpacing,
                        fontSize: '1.5rem',
                        color: i === 1 ? primaryColor : i === 2 ? secondaryColor : accentColor,
                        marginBottom: '0.75rem'
                      }}>
                        {i === 1 ? 'Tax Planning' : i === 2 ? 'Financial Reporting' : 'Business Advisory'}
                      </h3>
                      <p style={{
                        fontFamily: primaryFont,
                        marginBottom: '1rem'
                      }}>
                        {i === 1 
                          ? 'Strategic tax planning to minimize liabilities and ensure compliance.'
                          : i === 2 
                            ? 'Comprehensive financial reports with actionable insights for better decision-making.'
                            : 'Expert guidance to help you navigate challenges and capitalize on opportunities.'}
                      </p>
                      <Button
                        variant="link"
                        style={{ 
                          color: i === 1 ? primaryColor : i === 2 ? secondaryColor : accentColor,
                          padding: 0
                        }}
                      >
                        Learn more →
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button onClick={onClose}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}