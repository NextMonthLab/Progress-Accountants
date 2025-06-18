import { Card } from '@/components/ui/card';
import { Package, Download, Star, ExternalLink } from 'lucide-react';

interface MarketplaceTool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  price: number;
  icon?: React.ReactNode;
}

interface MarketplaceToolGridProps {
  tools?: MarketplaceTool[];
  onInstall?: (toolId: string) => void;
}

const defaultTools: MarketplaceTool[] = [
  {
    id: '1',
    name: 'Advanced Analytics',
    description: 'Comprehensive business analytics and reporting tools',
    category: 'Analytics',
    rating: 4.8,
    downloads: 1250,
    price: 49.99
  },
  {
    id: '2',
    name: 'Customer Portal',
    description: 'Self-service customer portal with document access',
    category: 'Client Management',
    rating: 4.6,
    downloads: 890,
    price: 29.99
  },
  {
    id: '3',
    name: 'Invoice Automation',
    description: 'Automated invoice generation and payment tracking',
    category: 'Automation',
    rating: 4.9,
    downloads: 2100,
    price: 39.99
  }
];

export function MarketplaceToolGrid({ tools = defaultTools, onInstall }: MarketplaceToolGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Card key={tool.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {tool.icon || <Package className="h-8 w-8 text-teal-600" />}
              <div>
                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                <span className="text-sm text-gray-500">{tool.category}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{tool.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 text-sm">{tool.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>{tool.downloads.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900">
              ${tool.price}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onInstall?.(tool.id)}
              className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Install
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}