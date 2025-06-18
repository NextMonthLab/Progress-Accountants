import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Users, BarChart3, MessageSquare, Brain, Zap, TrendingUp, Eye, Globe, Shield } from "lucide-react";

export default function AdminStyleDemo() {
  return (
    <div className="admin-dashboard dark" data-admin>
      {/* Background gradients and effects are handled by CSS */}
      <div className="relative z-10 min-h-screen p-6 space-y-8">
        
        {/* Header */}
        <div className="admin-header p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">SmartSite Control Room</h1>
              <p className="text-gray-300 mt-2">Intelligent Business Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="admin-badge">
                <Zap className="w-3 h-3 mr-1" />
                Pro Active
              </Badge>
              <Button className="admin-btn-primary">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-grid-stats">
          <div className="admin-stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Active Users</h3>
                <p className="text-3xl font-bold text-white mt-2">2,847</p>
                <p className="text-green-400 text-sm mt-1">↗ +12% from last month</p>
              </div>
              <Users className="w-12 h-12 text-purple-400" />
            </div>
          </div>

          <div className="admin-stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Revenue</h3>
                <p className="text-3xl font-bold text-white mt-2">£47,892</p>
                <p className="text-green-400 text-sm mt-1">↗ +28% from last month</p>
              </div>
              <TrendingUp className="w-12 h-12 text-indigo-400" />
            </div>
          </div>

          <div className="admin-stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Insights Generated</h3>
                <p className="text-3xl font-bold text-white mt-2">1,249</p>
                <p className="text-blue-400 text-sm mt-1">↗ +45% from last month</p>
              </div>
              <Brain className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="admin-stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Conversion Rate</h3>
                <p className="text-3xl font-bold text-white mt-2">24.8%</p>
                <p className="text-purple-400 text-sm mt-1">↗ +8% from last month</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="admin-tabs-list">
            <TabsTrigger value="overview" className="admin-tabs-trigger">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="admin-tabs-trigger">
              <Brain className="w-4 h-4 mr-2" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="settings" className="admin-tabs-trigger">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="admin-tabs-trigger">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="admin-grid">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest system interactions and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">New client inquiry received</span>
                    <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">AI insight generated for Project Alpha</span>
                    <span className="text-xs text-gray-400 ml-auto">15 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">System optimization completed</span>
                    <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-indigo-400" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>System health and performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Server Performance</span>
                      <span className="text-green-400">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Processing</span>
                      <span className="text-blue-400">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Health</span>
                      <span className="text-purple-400">99%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <div className="admin-grid">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    AI Insights Engine
                  </CardTitle>
                  <CardDescription>Intelligent business analysis and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-purple-300">Market Opportunity Detected</h4>
                    <p className="text-sm text-gray-300 mt-2">
                      AI analysis suggests expanding service offerings in Q2 could increase revenue by 23%
                    </p>
                    <Button size="sm" className="mt-3 admin-btn-primary">View Details</Button>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-blue-300">Client Behavior Pattern</h4>
                    <p className="text-sm text-gray-300 mt-2">
                      Identified optimal engagement times that could improve conversion by 18%
                    </p>
                    <Button size="sm" className="mt-3 admin-btn-secondary">Implement</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-indigo-400" />
                    Smart Automation
                  </CardTitle>
                  <CardDescription>Automated processes and intelligent workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h5 className="font-medium">Lead Scoring</h5>
                      <p className="text-xs text-gray-400">Automatically prioritize prospects</p>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h5 className="font-medium">Content Optimization</h5>
                      <p className="text-xs text-gray-400">AI-powered SEO improvements</p>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h5 className="font-medium">Market Analysis</h5>
                      <p className="text-xs text-gray-400">Competitive intelligence gathering</p>
                    </div>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">Scheduled</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="admin-grid">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-indigo-400" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>Core system settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input 
                      id="business-name" 
                      defaultValue="Progress Accountants" 
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input 
                      id="admin-email" 
                      defaultValue="admin@progressaccountants.com" 
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">Preferred AI Model</Label>
                    <select className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 text-white">
                      <option>GPT-4o (Premium)</option>
                      <option>Claude Sonnet 4</option>
                      <option>Mistral 7B (Local)</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <Button className="admin-btn-primary w-full">
                      Save Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-400" />
                    Advanced Features
                  </CardTitle>
                  <CardDescription>Premium functionality and integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">System Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Enter system configuration notes..."
                      className="w-full h-24"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h5 className="font-medium">API Rate Limiting</h5>
                      <p className="text-xs text-gray-400">Intelligent request throttling</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <h5 className="font-medium">Auto Backup</h5>
                      <p className="text-xs text-gray-400">Daily automated backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="admin-grid">
              <Card className="admin-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    Security Status
                  </CardTitle>
                  <CardDescription>System security monitoring and controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-green-300">System Secure</h4>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">All Clear</Badge>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">
                      All security checks passed. Last scan: 2 minutes ago
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge className="bg-green-500/20 text-green-300">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Encryption</span>
                      <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Authentication</span>
                      <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup Status</span>
                      <Badge className="bg-blue-500/20 text-blue-300">Updated</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}