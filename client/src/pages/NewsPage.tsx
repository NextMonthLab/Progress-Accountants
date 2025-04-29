import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, User, Tag, FileText, BookOpen, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  imageUrl: string;
  slug: string;
};

// Blog post data - empty array to start with
const BLOG_POSTS: BlogPost[] = [];

// Unique categories from blog posts
const CATEGORIES = Array.from(new Set(BLOG_POSTS.map(post => post.category)));

// Unique tags from blog posts
const TAGS = Array.from(new Set(BLOG_POSTS.flatMap(post => post.tags)));

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // Filter posts based on search query, category, and tag
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Paginate posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section with Background */}
      <div className="bg-gradient-to-b from-[var(--navy)] to-blue-900 py-16 mb-10">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              News & <span className="text-[var(--orange)]">Insights</span>
            </h1>
            <div className="w-24 h-1 bg-[var(--orange)] mx-auto my-6"></div>
            <p className="text-lg text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Stay up to date with the latest accounting news, industry insights, and expert advice 
              to help your business thrive financially.
            </p>
          </div>
        </div>
      </div>
      
      {/* Featured Content Cards */}
      <div className="container mx-auto px-6 md:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-white shadow-md border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="text-blue-500 h-6 w-6" />
              </div>
              <CardTitle className="text-[var(--navy)]">Latest Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Stay informed with our most recent accounting and tax updates.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" onClick={() => setSelectedCategory(null)}>
                Browse Articles
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-white shadow-md border-t-4 border-t-[var(--orange)] hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <BookOpen className="text-[var(--orange)] h-6 w-6" />
              </div>
              <CardTitle className="text-[var(--navy)]">Industry Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Discover in-depth analysis of trends in various industries.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-[var(--orange)] text-[var(--orange)] hover:bg-orange-50">
                Explore Insights
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-white shadow-md border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <ClipboardList className="text-green-500 h-6 w-6" />
              </div>
              <CardTitle className="text-[var(--navy)]">Tax Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Comprehensive guides to help navigate complex tax situations.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                View Guides
              </Button>
            </CardFooter>
          </Card>
        </div>
      
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--navy)]">Latest Articles</h2>
              <div className="text-sm text-gray-500">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
              </div>
            </div>
            
            {/* Search and filter area */}
            <div className="bg-gray-50 p-4 rounded-lg border mb-8">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 border-gray-300 focus:border-[var(--orange)] focus:ring-[var(--orange)]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                >
                  All Categories
                </Button>
                {CATEGORIES.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Blog posts list */}
            {currentPosts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedTag(null);
                    setCurrentPage(1);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {currentPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="md:col-span-1">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 p-0">
                        <CardHeader>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                            <span className="mx-1">•</span>
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <CardTitle className="text-xl font-bold text-[var(--navy)] hover:text-[var(--orange)] transition-colors">
                            <a href={`/news/${post.slug}`}>{post.title}</a>
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {post.excerpt}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                              <Button
                                key={tag}
                                variant="outline"
                                size="sm"
                                className="rounded-full text-xs py-1 h-auto"
                                onClick={() => {
                                  setSelectedTag(tag);
                                  setCurrentPage(1);
                                }}
                              >
                                #{tag}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="link"
                            className="px-0 text-[var(--orange)] hover:text-[var(--navy)]"
                            asChild
                          >
                            <a href={`/news/${post.slug}`}>Read more</a>
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-4">
              <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                <h3 className="text-lg font-semibold text-[var(--navy)] mb-2">Subscribe to Updates</h3>
                <p className="text-gray-600 text-sm mb-4">Get the latest accounting news and insights delivered to your inbox.</p>
                <Input 
                  placeholder="Your email address" 
                  className="mb-3 border-gray-300" 
                />
                <Button className="w-full">Subscribe</Button>
              </div>
            
              <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>
                
                <TabsContent value="categories" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Categories</CardTitle>
                      <CardDescription>Browse articles by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {CATEGORIES.map(category => (
                          <li key={category}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                setSelectedCategory(category);
                                setCurrentPage(1);
                              }}
                            >
                              <span className={`w-3 h-3 rounded-full bg-[var(--orange)] mr-2 ${selectedCategory === category ? 'opacity-100' : 'opacity-50'}`}></span>
                              {category}
                              <span className="ml-auto text-sm text-gray-500">
                                {BLOG_POSTS.filter(post => post.category === category).length}
                              </span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="popular" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Articles</CardTitle>
                      <CardDescription>Most read content this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {BLOG_POSTS.slice(0, 3).map(post => (
                          <li key={post.id} className="flex gap-4">
                            <div className="flex-shrink-0 w-16 h-16">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm line-clamp-2">
                                <a 
                                  href={`/news/${post.slug}`}
                                  className="hover:text-[var(--orange)] transition-colors"
                                >
                                  {post.title}
                                </a>
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tags" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Tags</CardTitle>
                      <CardDescription>Browse content by topic</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map(tag => (
                          <Button
                            key={tag}
                            variant={selectedTag === tag ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => {
                              setSelectedTag(tag);
                              setCurrentPage(1);
                            }}
                          >
                            #{tag}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Call to Action Card */}
              <Card className="mt-6 bg-[var(--navy)] text-white">
                <CardHeader>
                  <CardTitle>Need Accounting Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our team of experts is ready to help you with any accounting or tax questions.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-[var(--navy)]">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;