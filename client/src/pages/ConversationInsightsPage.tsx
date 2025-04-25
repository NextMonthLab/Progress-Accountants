import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Search, 
  Sparkles, 
  Tag, 
  Banknote, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Eye, 
  Filter, 
  BarChart 
} from 'lucide-react';

type Insight = {
  id: number;
  conversationId: string;
  userMessage: string;
  agentResponse: string;
  mode: string;
  intent: string;
  sentiment: string;
  leadPotential: boolean;
  confusionDetected: boolean;
  tags: string[];
  analysisNotes: string;
  metadata: any;
  createdAt: string;
};

type Stats = {
  totalConversations: number;
  totalInsights: number;
  leadPotential: number;
};

export default function ConversationInsightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const { toast } = useToast();
  
  // Fetch conversation insights
  const { 
    data: insights = [] as Insight[], 
    isLoading, 
    error, 
    refetch 
  } = useQuery<Insight[]>({
    queryKey: ['/api/agent/insights'], 
    retry: false,
  });
  
  // Fetch statistics
  const { 
    data: stats = { totalConversations: 0, totalInsights: 0, leadPotential: 0 }, 
    isLoading: statsLoading 
  } = useQuery<Stats>({
    queryKey: ['/api/agent/stats'], 
    retry: false,
  });
  
  // Filter insights based on search term
  const filteredInsights = insights.filter((insight: Insight) => {
    return (
      insight.userMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.intent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get sentiment badge color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Stats sections
  const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <Card className="w-full sm:w-auto flex-1">
      <CardHeader className={`${color} flex flex-row items-center justify-between space-y-0 pb-2`}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
  
  // Render main page
  return (
    <AdminLayout>
      <Helmet>
        <title>Conversation Insights | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Conversation Insights</h1>
          <Button onClick={() => refetch()} variant="outline">
            Refresh Data
          </Button>
        </div>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Conversations" 
            value={stats.totalConversations} 
            icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
            color="bg-blue-50"
          />
          <StatCard 
            title="Total Insights" 
            value={stats.totalInsights} 
            icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
            color="bg-purple-50"
          />
          <StatCard 
            title="Potential Leads" 
            value={stats.leadPotential} 
            icon={<Banknote className="h-4 w-4 text-muted-foreground" />}
            color="bg-green-50"
          />
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Conversation Analytics</CardTitle>
            <CardDescription>
              Insights generated from visitor conversations with Progress Agent
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by content, intent or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>Error loading insights. Please try again.</p>
              </div>
            ) : filteredInsights.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No conversation insights found.</p>
                {searchTerm && <p className="mt-2">Try adjusting your search criteria.</p>}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead className="w-[100px]">Sentiment</TableHead>
                    <TableHead className="w-[100px]">Lead</TableHead>
                    <TableHead className="w-[250px]">Tags</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInsights.map((insight: Insight) => (
                    <TableRow key={insight.id}>
                      <TableCell className="font-medium">
                        {formatDate(insight.createdAt)}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]" title={insight.intent}>
                        {insight.intent}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSentimentColor(insight.sentiment)}>
                          {insight.sentiment || 'neutral'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {insight.leadPotential ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {insight.tags?.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {insight.tags?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{insight.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedInsight(insight)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Conversation Insight Details</DialogTitle>
                              <DialogDescription>
                                Complete analysis of the conversation with Progress Agent
                              </DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="conversation" className="mt-4">
                              <TabsList>
                                <TabsTrigger value="conversation">Conversation</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                              </TabsList>
                              <TabsContent value="conversation" className="space-y-4">
                                <Card>
                                  <CardHeader className="bg-[var(--secondary)] py-3">
                                    <CardTitle className="text-sm flex items-center">
                                      <span className="mr-2">User Message</span>
                                      <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                                      <span className="text-xs text-muted-foreground">
                                        {selectedInsight && formatDate(selectedInsight.createdAt)}
                                      </span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-4">
                                    <ScrollArea className="h-[120px]">
                                      {selectedInsight?.userMessage}
                                    </ScrollArea>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="bg-[var(--primary)] text-white py-3">
                                    <CardTitle className="text-sm">Agent Response</CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-4">
                                    <ScrollArea className="h-[150px]">
                                      {selectedInsight?.agentResponse}
                                    </ScrollArea>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="analysis" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Card>
                                    <CardHeader className="py-3">
                                      <CardTitle className="text-sm flex items-center">
                                        <Tag className="h-4 w-4 mr-2" />
                                        Intent
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                      {selectedInsight?.intent}
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="py-3">
                                      <CardTitle className="text-sm flex items-center">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Sentiment
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                      <Badge className={`${selectedInsight && getSentimentColor(selectedInsight.sentiment)}`}>
                                        {selectedInsight?.sentiment || 'neutral'}
                                      </Badge>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="py-3">
                                      <CardTitle className="text-sm flex items-center">
                                        <Banknote className="h-4 w-4 mr-2" />
                                        Lead Potential
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                      {selectedInsight?.leadPotential ? (
                                        <Badge className="bg-green-100 text-green-800">Yes</Badge>
                                      ) : (
                                        <Badge className="bg-gray-100 text-gray-800">No</Badge>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                                <Card>
                                  <CardHeader className="py-3">
                                    <CardTitle className="text-sm">Analysis Notes</CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-2">
                                    {selectedInsight?.analysisNotes || 'No analysis provided'}
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="py-3">
                                    <CardTitle className="text-sm">Tags</CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-2">
                                    <div className="flex flex-wrap gap-2">
                                      {selectedInsight?.tags?.map((tag, index) => (
                                        <Badge key={index} variant="secondary">
                                          {tag}
                                        </Badge>
                                      )) || 'No tags available'}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredInsights.length} of {insights.length} conversations
            </div>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}