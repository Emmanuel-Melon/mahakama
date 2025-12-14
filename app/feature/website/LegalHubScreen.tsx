import { useState, useMemo } from "react";
import { Building2, Scale, HeartHandshake, Shield, Search, MapPin, X } from "lucide-react";
import { HeroSection } from "~/layouts/HeroSection";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { ServicesList } from "~/feature/legal-hub/services-list";
import type { LegalService, ServiceCategory } from "~/feature/legal-hub/types";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

// Mock data - In a real app, this would come from an API
const legalServices: LegalService[] = [
  {
    id: '1',
    name: 'Ministry of Justice - South Sudan',
    category: 'government',
    description: 'Government body responsible for legal affairs and justice administration.',
    location: 'Juba, South Sudan',
    contact: '+211 912 345 678',
    website: 'https://moj.gov.ss',
    services: ['Legal documentation', 'Court filings', 'Legal advice']
  },
  {
    id: '2',
    name: 'Legal Aid South Sudan',
    category: 'legal-aid',
    description: 'Provides free legal assistance to vulnerable populations.',
    location: 'Juba, South Sudan',
    contact: '+211 987 654 321',
    services: ['Free legal representation', 'Legal counseling', 'Awareness programs']
  },
  {
    id: '3',
    name: 'South Sudan Mediation Centre',
    category: 'dispute-resolution',
    description: 'Alternative dispute resolution services for civil matters.',
    location: 'Juba, South Sudan',
    contact: '+211 912 345 679',
    services: ['Mediation', 'Arbitration', 'Conflict resolution training']
  },
  {
    id: '4',
    name: 'South Sudan Human Rights Commission',
    category: 'government',
    description: 'Handles human rights violations and complaints.',
    location: 'Juba, South Sudan',
    contact: '+211 915 555 555',
    services: ['Human rights complaints', 'Legal advice', 'Advocacy']
  },
  {
    id: '5',
    name: 'Women & Child Legal Aid',
    category: 'specialized',
    description: 'Specialized legal services for women and children.',
    location: 'Juba, South Sudan',
    contact: '+211 912 888 999',
    services: ['Domestic violence cases', 'Child custody', 'Gender-based violence']
  }
];

const categoryIcons = {
  government: Building2,
  'legal-aid': Scale,
  'dispute-resolution': HeartHandshake,
  'specialized': Shield
} as const;

const categoryLabels = {
  government: 'Government',
  'legal-aid': 'Legal Aid',
  'dispute-resolution': 'Dispute Resolution',
  'specialized': 'Specialized'
} as const;


export const LegalHubScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredServices = useMemo(() => {
    return legalServices.filter((service) => {
      const matchesSearch = searchTerm === '' || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      const matchesLocation = locationFilter === '' || 
        service.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [legalServices, searchTerm, selectedCategory, locationFilter]);

  const categoryCounts = useMemo(() => {
    return legalServices.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [legalServices]);

  const locations = useMemo(() => {
    const uniqueLocations = new Set(legalServices.map(service => service.location));
    return Array.from(uniqueLocations).sort();
  }, [legalServices]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || locationFilter !== '';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setLocationFilter('');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-background">
        <HeroSection
          title="Legal Services Directory"
          description="Connect with government offices, legal aid providers, and dispute resolution services in South Sudan and Uganda."
          actionVariant="search"
          onSearch={(query: string) => setSearchTerm(query)}
          searchPlaceholder="Search for services, institutions, or locations..."
          icon={Building2}
        />
        <DiagonalSeparator />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <span>Filters {hasActiveFilters && `(${filteredServices.length} results)`}</span>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Sidebar */}
          <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-72 lg:w-80 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6 border-2 border-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                {hasActiveFilters && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Reset all
                  </button>
                )}
              </div>
              
              <ScrollArea className="pr-2 max-h-[calc(100vh-200px)]">
                <div className="space-y-6">
                  {/* Search Filter */}
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        id="location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      {locationFilter && (
                        <button
                          onClick={() => setLocationFilter('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Services', count: legalServices.length },
                        { value: 'government', label: 'Government', count: categoryCounts['government'] || 0 },
                        { value: 'legal-aid', label: 'Legal Aid', count: categoryCounts['legal-aid'] || 0 },
                        { value: 'dispute-resolution', label: 'Dispute Resolution', count: categoryCounts['dispute-resolution'] || 0 },
                        { value: 'specialized', label: 'Specialized', count: categoryCounts['specialized'] || 0 },
                      ].map(({ value, label, count }) => {
                        const Icon = value === 'all' ? Building2 : categoryIcons[value as keyof typeof categoryIcons];
                        const isSelected = selectedCategory === value;
                        
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedCategory(value as ServiceCategory)}
                            className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                              isSelected
                                ? 'bg-primary-100 text-primary-700 font-medium border-l-4 border-primary-500'
                                : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                            }`}
                          >
                            <Icon 
                              className={`h-4 w-4 flex-shrink-0 ${
                                isSelected ? 'text-primary-600' : 'text-gray-500'
                              }`} 
                            />
                            <span className="flex-1">{label}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              isSelected 
                                ? 'bg-primary-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              {isMobileFiltersOpen && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full"
                  >
                    Show {filteredServices.length} {filteredServices.length === 1 ? 'result' : 'results'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Services List */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredServices.length} {filteredServices.length === 1 ? 'Service' : 'Services'} 
                {hasActiveFilters && (
                  <span className="text-lg font-normal text-gray-500 ml-2">
                    (filtered from {legalServices.length})
                  </span>
                )}
              </h2>
              <div className="hidden md:block">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            
            <ServicesList 
              services={filteredServices} 
              variant="default"
              showControls={true}
              isLoading={false}
            />
            
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter criteria.
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="ml-1 text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
