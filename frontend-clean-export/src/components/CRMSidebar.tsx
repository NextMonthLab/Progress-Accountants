import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, RefreshCw, UserPlus } from 'lucide-react';
import { ServiceType, ProgressStage } from '@/lib/types';

interface CRMSidebarProps {
  serviceFilters: ServiceType[];
  setServiceFilters: React.Dispatch<React.SetStateAction<ServiceType[]>>;
  stageFilters: ProgressStage[];
  setStageFilters: React.Dispatch<React.SetStateAction<ProgressStage[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  resetFilters: () => void;
  onCreateClient?: () => void;
  serviceTypeCounts: Record<ServiceType, number>;
  stageCounts: Record<ProgressStage, number>;
}

export function CRMSidebar({
  serviceFilters,
  setServiceFilters,
  stageFilters,
  setStageFilters,
  searchTerm,
  setSearchTerm,
  resetFilters,
  onCreateClient,
  serviceTypeCounts,
  stageCounts
}: CRMSidebarProps) {
  const handleServiceFilterChange = (service: ServiceType) => {
    if (serviceFilters.includes(service)) {
      setServiceFilters(serviceFilters.filter(s => s !== service));
    } else {
      setServiceFilters([...serviceFilters, service]);
    }
  };

  const handleStageFilterChange = (stage: ProgressStage) => {
    if (stageFilters.includes(stage)) {
      setStageFilters(stageFilters.filter(s => s !== stage));
    } else {
      setStageFilters([...stageFilters, stage]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search already happens on change, but this enables form submit on Enter
  };

  // All available service types
  const allServiceTypes: ServiceType[] = [
    'Accounting', 
    'Tax', 
    'Payroll', 
    'VAT', 
    'Advisory', 
    'PodcastStudio'
  ];

  // All available progress stages
  const allProgressStages: ProgressStage[] = [
    'Onboarding',
    'Active', 
    'Review', 
    'TaxReturn', 
    'YearEnd'
  ];

  // Get badge background color based on service type
  const getServiceBadgeColor = (service: ServiceType): string => {
    switch (service) {
      case 'Accounting': return 'bg-blue-100 text-blue-800';
      case 'Tax': return 'bg-green-100 text-green-800';
      case 'Payroll': return 'bg-purple-100 text-purple-800';
      case 'VAT': return 'bg-pink-100 text-pink-800';
      case 'Advisory': return 'bg-amber-100 text-amber-800';
      case 'PodcastStudio': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get badge background color based on stage
  const getStageBadgeColor = (stage: ProgressStage): string => {
    switch (stage) {
      case 'Onboarding': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Review': return 'bg-amber-100 text-amber-800';
      case 'TaxReturn': return 'bg-purple-100 text-purple-800';
      case 'YearEnd': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full md:w-64 h-full flex flex-col">
      <Card className="w-full shadow-sm flex-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
              Filters
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters} 
              className="h-8 w-8 p-0"
              title="Reset all filters"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </form>
          
          {onCreateClient && (
            <Button 
              className="w-full mb-4" 
              onClick={onCreateClient}
              style={{ backgroundColor: 'var(--navy, #0F172A)' }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          )}

          <Separator className="my-4" />
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Service Type</h3>
              <Badge variant="outline" className="font-normal text-xs">
                <Filter className="h-3 w-3 mr-1" />
                {serviceFilters.length === 0 ? 'All' : `${serviceFilters.length} selected`}
              </Badge>
            </div>
            <div className="space-y-2">
              {allServiceTypes.map((service) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`service-${service}`} 
                      checked={serviceFilters.includes(service)}
                      onCheckedChange={() => handleServiceFilterChange(service)}
                    />
                    <Label 
                      htmlFor={`service-${service}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {service}
                    </Label>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`font-normal text-xs ${getServiceBadgeColor(service)}`}
                  >
                    {serviceTypeCounts[service] || 0}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Client Stage</h3>
              <Badge variant="outline" className="font-normal text-xs">
                <Filter className="h-3 w-3 mr-1" />
                {stageFilters.length === 0 ? 'All' : `${stageFilters.length} selected`}
              </Badge>
            </div>
            <div className="space-y-2">
              {allProgressStages.map((stage) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`stage-${stage}`} 
                      checked={stageFilters.includes(stage)}
                      onCheckedChange={() => handleStageFilterChange(stage)}
                    />
                    <Label 
                      htmlFor={`stage-${stage}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {stage}
                    </Label>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`font-normal text-xs ${getStageBadgeColor(stage)}`}
                  >
                    {stageCounts[stage] || 0}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CRMSidebar;