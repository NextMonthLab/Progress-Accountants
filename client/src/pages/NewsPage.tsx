import React, { useState } from 'react';
import { PublicLayout } from '@/layouts/PublicLayout';
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
import { Search, Calendar, User, Tag } from 'lucide-react';
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
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--navy)] mb-4">News & Insights</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay up to date with the latest accounting news, industry insights, and expert advice to help your business thrive financially.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="w-full md:w-2/3">
            {/* Search and filter area */}
            <div className="mb-8">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
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
              <div className="text-center py-12">
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
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                              setSelectedTag(tag === selectedTag ? null : tag);
                              setCurrentPage(1);
                            }}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Newsletter signup card */}
              <Card className="mt-6 bg-gradient-to-r from-[var(--navy)] to-[#1e3a5f] text-white">
                <CardHeader>
                  <CardTitle className="text-white">Subscribe to Our Newsletter</CardTitle>
                  <CardDescription className="text-blue-100">
                    Get the latest updates directly to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input
                      placeholder="Your email address"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    />
                    <Button className="w-full bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white">
                      Subscribe Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsPage;