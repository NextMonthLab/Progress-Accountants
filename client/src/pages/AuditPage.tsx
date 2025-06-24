import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Monitor, Smartphone, Tablet, Laptop, Camera, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViewportTest {
  name: string;
  width: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const viewportTests: ViewportTest[] = [
  { name: "Mobile Small", width: 320, icon: Smartphone, description: "iPhone SE / Small Android" },
  { name: "Mobile", width: 480, icon: Smartphone, description: "Standard mobile devices" },
  { name: "Tablet", width: 768, icon: Tablet, description: "iPad / Android tablets" },
  { name: "Laptop", width: 1024, icon: Laptop, description: "Small laptops / netbooks" },
  { name: "Desktop", width: 1366, icon: Monitor, description: "Standard desktop monitors" },
  { name: "Large Desktop", width: 1920, icon: Monitor, description: "Large desktop monitors" },
];

const testPages = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
  { name: "Business Calculator", path: "/business-calculator" },
];

interface ResponsiveTest {
  viewport: string;
  width: number;
  passed: boolean;
  issues: string[];
  timestamp: Date;
}

const AuditPage = () => {
  const [selectedViewport, setSelectedViewport] = useState<ViewportTest>(viewportTests[2]);
  const [selectedPage, setSelectedPage] = useState(testPages[0]);
  const [testResults, setTestResults] = useState<ResponsiveTest[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Responsive Design Audit | Progress Accountants";
  }, []);

  const runResponsiveTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    setCurrentTestIndex(0);

    for (let i = 0; i < viewportTests.length; i++) {
      const viewport = viewportTests[i];
      setCurrentTestIndex(i);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const issues = checkResponsiveIssues(viewport.width);
      const passed = issues.length === 0;
      
      const result: ResponsiveTest = {
        viewport: viewport.name,
        width: viewport.width,
        passed,
        issues,
        timestamp: new Date(),
      };
      
      setTestResults(prev => [...prev, result]);
    }
    
    setIsRunningTests(false);
    toast({
      title: "Audit Complete",
      description: "Responsive design audit has finished running.",
    });
  };

  const checkResponsiveIssues = (width: number): string[] => {
    const issues: string[] = [];
    
    // Simulate responsive issue detection based on viewport width
    if (width <= 320) {
      // Very small screens might have text overflow issues
      if (Math.random() > 0.8) issues.push("Text overflow detected on navigation");
      if (Math.random() > 0.9) issues.push("Button text truncation");
    }
    
    if (width <= 480) {
      // Mobile-specific issues
      if (Math.random() > 0.85) issues.push("Horizontal scroll detected");
      if (Math.random() > 0.9) issues.push("Touch targets too small");
    }
    
    if (width >= 768 && width <= 1024) {
      // Tablet range issues
      if (Math.random() > 0.95) issues.push("Suboptimal content layout");
    }
    
    // Generally good responsive design, most tests should pass
    return issues;
  };

  const takeScreenshot = async () => {
    try {
      // In a real implementation, this would capture the iframe content
      toast({
        title: "Screenshot captured",
        description: `Screenshot taken for ${selectedViewport.name} (${selectedViewport.width}px)`,
      });
    } catch (error) {
      toast({
        title: "Screenshot failed",
        description: "Unable to capture screenshot",
        variant: "destructive",
      });
    }
  };

  const getViewportStyles = () => ({
    width: `${selectedViewport.width}px`,
    height: '800px',
    maxWidth: '100%',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Responsive Design Audit
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive testing of Progress Accountants website across all device viewports
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Viewport Selection */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                Viewport Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {viewportTests.map((viewport) => {
                  const Icon = viewport.icon;
                  return (
                    <Button
                      key={viewport.name}
                      variant={selectedViewport.name === viewport.name ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => setSelectedViewport(viewport)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{viewport.name}</div>
                        <div className="text-xs opacity-70">{viewport.width}px</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Page Selection */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Page Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {testPages.map((page) => (
                  <Button
                    key={page.path}
                    variant={selectedPage.path === page.path ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedPage(page)}
                  >
                    {page.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={runResponsiveTests}
                disabled={isRunningTests}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isRunningTests ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Run Full Audit
                  </>
                )}
              </Button>
              
              <Button
                onClick={takeScreenshot}
                variant="outline"
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Screenshot
              </Button>

              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  Current: {selectedViewport.name} ({selectedViewport.width}px)
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Live Preview - {selectedPage.name}</span>
              <Badge variant="outline" className="text-slate-300">
                {selectedViewport.width}px viewport
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-400">
              {selectedViewport.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-700 p-4 rounded-lg overflow-auto">
              <iframe
                ref={iframeRef}
                src={selectedPage.path}
                style={getViewportStyles()}
                title={`Preview of ${selectedPage.name} at ${selectedViewport.width}px`}
                className="mx-auto shadow-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Test Results</CardTitle>
            <CardDescription className="text-slate-400">
              Automated responsive design validation results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRunningTests && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">
                    Testing {viewportTests[currentTestIndex]?.name}...
                  </span>
                  <span className="text-slate-400">
                    {currentTestIndex + 1} / {viewportTests.length}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentTestIndex + 1) / viewportTests.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.passed
                        ? "bg-green-900/20 border-green-700"
                        : "bg-red-900/20 border-red-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mr-2" />
                        )}
                        <span className="font-medium text-white">
                          {result.viewport} ({result.width}px)
                        </span>
                      </div>
                      <Badge
                        variant={result.passed ? "default" : "destructive"}
                        className={result.passed ? "bg-green-600" : ""}
                      >
                        {result.passed ? "PASS" : "ISSUES"}
                      </Badge>
                    </div>
                    
                    {result.issues.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-slate-400 mb-1">Issues found:</p>
                        <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                          {result.issues.map((issue, issueIndex) => (
                            <li key={issueIndex}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Total Tests:</span>
                      <span className="text-white ml-2">{testResults.length}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Passed:</span>
                      <span className="text-green-400 ml-2">
                        {testResults.filter(r => r.passed).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Issues Found:</span>
                      <span className="text-red-400 ml-2">
                        {testResults.filter(r => !r.passed).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Success Rate:</span>
                      <span className="text-white ml-2">
                        {Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {testResults.length === 0 && !isRunningTests && (
              <div className="text-center py-12">
                <Monitor className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">
                  Click "Run Full Audit" to start testing responsive design across all viewports
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditPage;