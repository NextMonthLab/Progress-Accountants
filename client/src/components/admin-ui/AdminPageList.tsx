import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TextGradient } from './AdminCard';
import { GradientButton, ActionButton, Badge } from './AdminButtons';
import { 
  FileText, 
  Pencil, 
  Trash, 
  Plus, 
  Clock, 
  Filter, 
  Search,
  ExternalLink,
  Lock,
  CheckCircle
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  path: string;
  type: string;
  status: string;
  lastUpdated: string;
  locked: boolean;
}

interface AdminPageListProps {
  className?: string;
}

export function AdminPageList({ className }: AdminPageListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data - this would typically come from an API
  const pages: Page[] = [
    { 
      id: '1', 
      title: 'Test Page', 
      path: '/test-page', 
      type: 'Custom Page', 
      status: 'Draft',
      lastUpdated: 'Apr 30, 2025',
      locked: false
    },
    { 
      id: '2', 
      title: 'test', 
      path: '/test1', 
      type: 'Custom Page', 
      status: 'Draft',
      lastUpdated: 'Apr 23, 2025',
      locked: false
    },
    { 
      id: '3', 
      title: 'Tes', 
      path: '/test', 
      type: 'Core Page', 
      status: 'Draft',
      lastUpdated: 'Apr 23, 2025',
      locked: false
    }
  ];
  
  return (
    <div className={cn("", className)}>
      {/* Page header */}
      <div className="mb-8 relative overflow-hidden rounded-xl dark:bg-[#0A0A0A] bg-white p-8 shadow-md dark:border-[#1D1D1D] border-gray-200">
        {/* Grid pattern */}
        <div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white text-gray-900">
                <TextGradient text="Pages" gradient="primary" />
              </h1>
              <p className="dark:text-[#E0E0E0] text-gray-700 mt-2 text-lg max-w-xl">
                Create and manage your website pages
              </p>
            </div>
            
            <GradientButton className="sm:self-start flex items-center gap-2">
              <Plus className="h-4 w-4" /> 
              Create New Page
            </GradientButton>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <FileText className="h-60 w-60 text-[#F65C9A]" />
        </div>
      </div>
      
      {/* Controls area */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 grid w-full rounded-lg overflow-hidden shadow-sm">
          <div className="flex">
            <button
              className={cn(
                "dark:text-white text-gray-800 py-3 px-4 flex items-center gap-2 text-sm font-medium transition-colors",
                activeTab === 'all' 
                  ? "dark:bg-[#121212] bg-gray-50 dark:text-white text-gray-900 border-b-2 border-[#F65C9A]" 
                  : "dark:text-[#9E9E9E] text-gray-600 border-b-2 border-transparent"
              )}
              onClick={() => setActiveTab('all')}
            >
              All Pages
            </button>
            
            <button
              className={cn(
                "dark:text-white text-gray-800 py-3 px-4 flex items-center gap-2 text-sm font-medium transition-colors",
                activeTab === 'published' 
                  ? "dark:bg-[#121212] bg-gray-50 dark:text-white text-gray-900 border-b-2 border-[#F65C9A]" 
                  : "dark:text-[#9E9E9E] text-gray-600 border-b-2 border-transparent"
              )}
              onClick={() => setActiveTab('published')}
            >
              Published
            </button>
            
            <button
              className={cn(
                "dark:text-white text-gray-800 py-3 px-4 flex items-center gap-2 text-sm font-medium transition-colors",
                activeTab === 'draft' 
                  ? "dark:bg-[#121212] bg-gray-50 dark:text-white text-gray-900 border-b-2 border-[#F65C9A]" 
                  : "dark:text-[#9E9E9E] text-gray-600 border-b-2 border-transparent"
              )}
              onClick={() => setActiveTab('draft')}
            >
              Draft
            </button>
          </div>
        </div>
        
        <div className="relative dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 rounded-lg overflow-hidden shadow-sm px-4 py-2 min-w-[250px]">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input 
              type="text" 
              placeholder="Search pages..." 
              className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white text-gray-900 placeholder:dark:text-gray-400 placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Page table */}
      <div className="dark:bg-[#0A0A0A] bg-white dark:border-[#1D1D1D] border-gray-200 rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="border-b dark:border-[#1D1D1D] border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">Title</th>
              <th className="text-left py-4 px-6 dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">Path</th>
              <th className="text-left py-4 px-6 dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">Type</th>
              <th className="text-left py-4 px-6 dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">Status</th>
              <th className="text-left py-4 px-6 dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">Last Updated</th>
              <th className="text-left py-4 px-6 dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">Locked</th>
              <th className="text-left py-4 px-6 dark:text-[#9E9E9E] text-gray-500 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b dark:border-[#1D1D1D] border-gray-200 hover:dark:bg-[#121212] hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 dark:text-white text-gray-900 text-sm">{page.title}</td>
                <td className="py-4 px-6 dark:text-[#E0E0E0] text-gray-700 text-sm">{page.path}</td>
                <td className="py-4 px-6 dark:text-[#E0E0E0] text-gray-700 text-sm">{page.type}</td>
                <td className="py-4 px-6">
                  <Badge
                    text={page.status}
                    variant={page.status === 'Published' ? 'success' : 'default'}
                  />
                </td>
                <td className="py-4 px-6 dark:text-[#E0E0E0] text-gray-700 text-sm flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#9E9E9E]" />
                  {page.lastUpdated}
                </td>
                <td className="py-4 px-6 dark:text-[#E0E0E0] text-gray-700 text-sm">
                  {page.locked ? (
                    <Lock className="h-4 w-4 text-[#F65C9A]" />
                  ) : (
                    <span className="text-[#3CBFAE]">—</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 dark:bg-[#121212] bg-gray-50 rounded-md dark:text-white text-gray-800 hover:dark:bg-[#1D1D1D] hover:bg-gray-100 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 dark:bg-[#121212] bg-gray-50 rounded-md dark:text-white text-gray-800 hover:dark:bg-[#1D1D1D] hover:bg-gray-100 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 dark:bg-[#121212] bg-gray-50 rounded-md text-red-500 hover:dark:bg-[#1D1D1D] hover:bg-gray-100 transition-colors">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}