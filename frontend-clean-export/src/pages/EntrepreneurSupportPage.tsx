import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import AdminLayout from "@/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Star, PlusCircle, Edit3, Calendar as CalendarIcon, Bookmark, TrendingUp, BarChart2 } from "lucide-react";
import NewsItem from "@/components/entrepreneur/NewsItem";
import JournalEntry from "@/components/entrepreneur/JournalEntry";
import { EntrepreneurInsight } from "@/components/entrepreneur/EntrepreneurInsight";
import { EntrepreneurCompanion } from "@/components/entrepreneur/EntrepreneurCompanion";
import NoAccess from "@/components/NoAccess";

// Types for our journal entries
export interface JournalEntryType {
  id: number;
  date: Date;
  category: "thoughts" | "feelings" | "ideas" | "challenges" | "opportunities";
  content: string;
  mood?: "positive" | "neutral" | "negative" | null;
}

// Types for news items
export interface NewsItemType {
  id: number;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  imageUrl?: string;
}

const EntrepreneurSupportPage = () => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItemType[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntryType[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntryType>>({
    category: "thoughts",
    content: "",
    mood: "neutral",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [insights, setInsights] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("news");
  const [isSoloEntrepreneur, setIsSoloEntrepreneur] = useState(false);

  // Check if user has access to this page
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      try {
        // TEMPORARY: Always set to true for testing purposes
        setIsSoloEntrepreneur(true);
        
        // Load journal entries and news
        await loadJournalEntries();
        await loadNews();
        await loadInsights();
        
        // Original code (commented out for now)
        // Check if the tenant is set up for Solo Entrepreneur mode
        // if (tenant?.featureFlags) {
        //   setIsSoloEntrepreneur(tenant.featureFlags.entrepreneurSupport === true);
        // }
        
        // Load journal entries and news for authorized users
        // if (isSoloEntrepreneur) {
        //   await loadJournalEntries();
        //   await loadNews();
        //   await loadInsights();
        // }
      } catch (error) {
        console.error("Error checking access:", error);
        toast({
          title: "Error",
          description: "Failed to verify access to this feature",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, tenant]);

  const loadJournalEntries = async () => {
    // In a real implementation, this would fetch from the API
    // For now, use mock data
    const mockEntries: JournalEntryType[] = [
      {
        id: 1,
        date: new Date(Date.now() - 86400000), // Yesterday
        category: "thoughts",
        content: "Thinking about expanding my service offerings next month. Need to research market demand.",
        mood: "positive"
      },
      {
        id: 2,
        date: new Date(Date.now() - 172800000), // 2 days ago
        category: "challenges",
        content: "Having trouble balancing client work with admin tasks. Need to create a better schedule.",
        mood: "negative"
      },
      {
        id: 3,
        date: new Date(Date.now() - 259200000), // 3 days ago
        category: "ideas",
        content: "What if I created a monthly newsletter for my clients with industry updates and insights?",
        mood: "positive"
      }
    ];
    
    setJournalEntries(mockEntries);
  };

  const loadNews = async () => {
    // In a real implementation, this would fetch from a news API
    // For now, use mock data
    const mockNews: NewsItemType[] = [
      {
        id: 1,
        title: "Small Business Tax Changes You Need to Know for 2025",
        source: "Entrepreneur.com",
        date: "2 hours ago",
        summary: "Recent updates to small business tax code may benefit solo entrepreneurs and small consultancies.",
        url: "#",
        imageUrl: "https://placehold.co/100x60"
      },
      {
        id: 2,
        title: "5 Time Management Strategies for Solo Business Owners",
        source: "Forbes Small Business",
        date: "Yesterday",
        summary: "Effective strategies to maximize productivity when you're handling every aspect of your business alone.",
        url: "#",
        imageUrl: "https://placehold.co/100x60"
      },
      {
        id: 3,
        title: "How to Scale a Consulting Business Without Hiring Staff",
        source: "Inc Magazine",
        date: "2 days ago",
        summary: "Leveraging technology and partners to grow your consulting practice without taking on employees.",
        url: "#",
        imageUrl: "https://placehold.co/100x60"
      }
    ];
    
    setNewsItems(mockNews);
  };

  const loadInsights = async () => {
    // In a real implementation, this would call an AI analysis endpoint
    // For now, use mock insights
    const mockInsights = [
      "Based on your recent journal entries, you seem to be experiencing higher stress around client deadlines.",
      "You've mentioned creative ideas in 70% of your entries this week - this is an excellent trend for business innovation!",
      "Consider setting aside dedicated admin time each morning based on your noted productivity patterns."
    ];
    
    setInsights(mockInsights);
  };

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.content || newEntry.content.trim() === "") {
      toast({
        title: "Empty entry",
        description: "Please write something before saving your journal entry",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would save to the API
    const newJournalEntry: JournalEntryType = {
      id: Date.now(),
      date: new Date(),
      category: newEntry.category as JournalEntryType["category"],
      content: newEntry.content,
      mood: newEntry.mood as JournalEntryType["mood"]
    };
    
    setJournalEntries([newJournalEntry, ...journalEntries]);
    
    // Reset form
    setNewEntry({
      category: "thoughts",
      content: "",
      mood: "neutral"
    });
    
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been securely saved",
    });
    
    // After adding a new entry, we should refresh insights
    // In a real implementation, this would trigger an AI analysis
    setTimeout(() => {
      loadInsights();
    }, 1000);
  };

  const refreshNews = async () => {
    toast({
      title: "Refreshing news",
      description: "Getting the latest entrepreneur news updates...",
    });
    
    // In a real implementation, this would fetch new articles
    setTimeout(() => {
      loadNews();
      toast({
        title: "News refreshed",
        description: "Latest entrepreneur news has been loaded",
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading entrepreneur support hub...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!isSoloEntrepreneur) {
    return (
      <AdminLayout>
        <NoAccess 
          title="Solo Entrepreneur Access Only"
          message="This feature is exclusively available for accounts using the Solo Entrepreneur site version. Please contact your administrator if you believe you should have access."
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Entrepreneur Support Hub</h1>
            <p className="text-muted-foreground">
              Your private space for business growth, reflection, and personalized support
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tabs for News and Journal */}
          <div className="col-span-2">
            <Tabs defaultValue="news" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="news">Entrepreneur News</TabsTrigger>
                <TabsTrigger value="journal">Support Journal</TabsTrigger>
              </TabsList>

              {/* News Feed Tab */}
              <TabsContent value="news" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Latest Business & Entrepreneurship News</h2>
                  <Button variant="outline" size="sm" onClick={refreshNews}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <div className="space-y-4">
                  {newsItems.map(item => (
                    <NewsItem key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>

              {/* Journal Tab */}
              <TabsContent value="journal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>New Journal Entry</CardTitle>
                    <CardDescription>
                      Record your entrepreneurial journey - your thoughts, ideas, challenges, and opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleJournalSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="category" className="text-sm font-medium">Category</label>
                          <Select 
                            value={newEntry.category}
                            onValueChange={(value) => setNewEntry({...newEntry, category: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="thoughts">Thoughts</SelectItem>
                              <SelectItem value="feelings">Feelings</SelectItem>
                              <SelectItem value="ideas">Ideas</SelectItem>
                              <SelectItem value="challenges">Challenges</SelectItem>
                              <SelectItem value="opportunities">Opportunities</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="mood" className="text-sm font-medium">Current Mood</label>
                          <Select 
                            value={newEntry.mood || 'neutral'}
                            onValueChange={(value) => setNewEntry({...newEntry, mood: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="How are you feeling?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positive">Positive 😊</SelectItem>
                              <SelectItem value="neutral">Neutral 😐</SelectItem>
                              <SelectItem value="negative">Challenging 😔</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">Journal Entry</label>
                        <Textarea 
                          id="content"
                          placeholder="What's on your mind today?"
                          value={newEntry.content}
                          onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                          rows={5}
                          className="resize-none"
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={() => setNewEntry({
                      category: "thoughts",
                      content: "",
                      mood: "neutral"
                    })}>
                      Clear
                    </Button>
                    <Button onClick={handleJournalSubmit}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Save Entry
                    </Button>
                  </CardFooter>
                </Card>

                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">Recent Journal Entries</h3>
                  {journalEntries.length > 0 ? (
                    journalEntries.map(entry => (
                      <JournalEntry key={entry.id} entry={entry} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No journal entries yet. Start documenting your entrepreneurial journey above!
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Calendar, AI Insights & Support */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Your Journey Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                  Personalized Insights
                </CardTitle>
                <CardDescription>
                  AI-powered analysis based on your journal entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EntrepreneurInsight insights={insights} />
              </CardContent>
            </Card>

            {/* Entrepreneur Companion */}
            <Card className="bg-secondary/10">
              <CardHeader>
                <CardTitle>Your Entrepreneur Companion</CardTitle>
                <CardDescription>
                  Context-aware personalized support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EntrepreneurCompanion />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EntrepreneurSupportPage;