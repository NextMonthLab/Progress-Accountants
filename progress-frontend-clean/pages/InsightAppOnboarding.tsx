import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  Users, 
  Mail,
  Plus,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Info
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InsightUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  inviteSentAt: string;
  insightCount: number;
  lastSubmissionDate?: string;
  isActive: boolean;
}

interface InsightSubmission {
  id: number;
  content: string;
  submittedBy: string;
  submittedAt: string;
  type: string;
}

export default function InsightAppOnboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Fetch insight users
  const { data: insightUsers = [], isLoading: usersLoading } = useQuery<InsightUser[]>({
    queryKey: ["/api/insight-app/users"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/insight-app/users");
      return response.json();
    }
  });

  // Fetch recent insights
  const { data: recentInsights = [] } = useQuery<InsightSubmission[]>({
    queryKey: ["/api/insight-app/insights"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/insight-app/insights");
      return response.json();
    }
  });

  // Send invite mutation
  const sendInvite = useMutation({
    mutationFn: async (userData: { firstName: string; lastName: string; email: string }) => {
      const response = await apiRequest("POST", "/api/insight-app/invite", userData);
      return response.json();
    },
    onSuccess: (data) => {
      setInviteSuccess(`Invite sent successfully to ${data.email}`);
      setFirstName("");
      setLastName("");
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/insight-app/users"] });
      
      // Clear success message after 5 seconds
      setTimeout(() => setInviteSuccess(null), 5000);
    },
    onError: (error: Error) => {
      toast({
        title: "Invite failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    sendInvite.mutate({ firstName, lastName, email });
  };

  const navigateToLeaderboard = () => {
    window.location.href = '/admin/insights-dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-cyan-600" />
            Insight App Onboarding
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enable your team to quickly share observations, stories, and feedback that feed directly into your insights dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* What is the Insight App? */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  What is the Insight App?
                  <Popover>
                    <PopoverTrigger asChild>
                      <Info className="h-4 w-4 text-gray-500 cursor-help" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Why collect insights?</h4>
                        <p className="text-sm text-gray-600">
                          Team insights help you spot opportunities, address issues early, and understand your business from the ground up.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                <CardDescription>
                  A lightweight tool for team members to share important stories and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 font-medium mb-3">
                    "The Insight App gives every member of your team a way to share important stories, ideas, and feedback — in 30 seconds or less."
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Your team can submit:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Good news stories and testimonials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Employee frustrations or wins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Customer complaints or praise</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Suggestions for improvement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Employee satisfaction cues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Lead triggers from conversations</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-600" />
                    All insights feed directly into your leaderboard — no login needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Add Team Member */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Add a Team Member
                </CardTitle>
                <CardDescription>
                  Send an Insight App invite to a team member
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inviteSuccess && (
                  <Alert className="mb-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {inviteSuccess}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="team.member@company.com"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sendInvite.isPending}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {sendInvite.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Send Insight App Invite
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium mb-1">Email will include:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Subject: "You've been invited to use the Insight App"</li>
                    <li>• Personal link requiring no login</li>
                    <li>• Instructions for quick submission</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Users with access to the Insight App
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : insightUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No team members added yet</p>
                    <p className="text-xs mt-1">Add your first team member to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {insightUsers.map((user) => (
                      <div key={user.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.insightCount} insights
                            </Badge>
                            {user.lastSubmissionDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last: {new Date(user.lastSubmissionDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Recent Insights
                </CardTitle>
                <CardDescription>
                  Latest submissions from your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentInsights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No insights submitted yet</p>
                    <p className="text-xs mt-1">Insights will appear here once team members start submitting</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recentInsights.slice(0, 5).map((insight) => (
                      <div key={insight.id} className="p-3 border rounded-lg">
                        <p className="text-sm text-gray-800 mb-2">{insight.content}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {insight.submittedBy}</span>
                          <span>{new Date(insight.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={navigateToLeaderboard}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600">
                      {insightUsers.length}
                    </div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {insightUsers.reduce((sum, user) => sum + user.insightCount, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Insights</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}