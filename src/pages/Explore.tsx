import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NgoInfoPanel from '@/components/NgoInfoPanel';
import Map from '@/components/Map';
import NotificationStack from '@/components/NotificationStack';
import { ngoData } from '@/data/ngoData';

// Updated NGO data structure to match the NgoInfoPanel component
interface NGO {
  id: number;
  name: string;
  description: string;
  position: [number, number];
  category: string;
  volunteersNeeded: number;
  address: string;
  contact: string;
  urgentNeeds: string[];
}

// Convert imported ngoData to match the NGO interface
const mockNgos: NGO[] = ngoData.map(ngo => ({
  id: ngo.id,
  name: ngo.name,
  description: `${ngo.name} - Working for ${ngo.category.toLowerCase()} in Coimbatore`,
  position: [ngo.latitude, ngo.longitude] as [number, number],
  category: ngo.category.toLowerCase().replace(' ', ''),
  volunteersNeeded: Math.floor(Math.random() * 20) + 5, // Random number between 5-25
  address: `${ngo.name.split(' ')[0]}, Coimbatore`,
  contact: `+91-422-${Math.floor(Math.random() * 9000000) + 1000000}`,
  urgentNeeds: getUrgentNeedsByCategory(ngo.category)
}));

// Helper function to generate urgent needs based on category
function getUrgentNeedsByCategory(category: string): string[] {
  const needsByCategory = {
    'Environment': ['Tree planters', 'Environmental educators', 'Cleanup volunteers'],
    'Education': ['Math tutors', 'English teachers', 'Computer instructors'],
    'Healthcare': ['Doctors', 'Nurses', 'Medical assistants'],
    'Women Empowerment': ['Skill trainers', 'Counselors', 'Administrative support'],
    'Animal Welfare': ['Animal caretakers', 'Veterinary assistants', 'Fundraising volunteers']
  };
  return needsByCategory[category as keyof typeof needsByCategory] || ['General volunteers'];
}

const Explore = () => {
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredNgos, setFilteredNgos] = useState<NGO[]>(mockNgos);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleMarkerClick = (ngo: NGO) => {
    setSelectedNgo(ngo);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Show suggestions if there's text
    if (query.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    
    filterNgos(query, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setShowSuggestions(false);
    filterNgos(searchQuery, category);
  };

  const handleSuggestionClick = (ngo: NGO) => {
    console.log('=== SUGGESTION CLICKED ===');
    console.log('NGO:', ngo);
    
    // Immediately update the UI
    setSearchQuery(ngo.name);
    setSelectedNgo(ngo);
    setShowSuggestions(false);
    
    // Filter the map to show only this NGO
    filterNgos(ngo.name, selectedCategory);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
    
    // Add visual feedback - briefly highlight the selected suggestion
    const suggestionElement = document.querySelector(`[data-ngo-id="${ngo.id}"]`);
    if (suggestionElement) {
      suggestionElement.classList.add('bg-accent-red/10', 'border-accent-red/20');
      setTimeout(() => {
        suggestionElement.classList.remove('bg-accent-red/10', 'border-accent-red/20');
      }, 300);
    }
    
    console.log('=== END SUGGESTION CLICK ===');
  };

  const filterNgos = (query: string, category: string) => {
    let filtered = mockNgos;

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(ngo => 
        ngo.name.toLowerCase().includes(query.toLowerCase()) ||
        ngo.description.toLowerCase().includes(query.toLowerCase()) ||
        ngo.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'All') {
      const categoryMap: { [key: string]: string } = {
        'Education': 'education',
        'Healthcare': 'healthcare',
        'Environment': 'environment',
        'Women Empowerment': 'womenempowerment',
        'Animal Welfare': 'animalwelfare'
      };
      const categoryKey = categoryMap[category];
      if (categoryKey) {
        filtered = filtered.filter(ngo => ngo.category === categoryKey);
      }
    }

    setFilteredNgos(filtered);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update filtered NGOs when component mounts
  useEffect(() => {
    setFilteredNgos(mockNgos);
  }, []);

  return (
    <div className="relative w-full h-screen bg-dark-blue overflow-hidden">
      {/* Map Layer - Base Layer */}
      <div className="absolute inset-0 z-10">
        <Map ngos={filteredNgos} onMarkerClick={handleMarkerClick} />
      </div>

      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-off-white hover:bg-light-dark-blue bg-dark-blue/80 backdrop-blur-sm">
              <MapPin className="w-5 h-5 mr-2" />
              Explore NGOs in Coimbatore
            </Button>
          </div>
          <div className="flex items-center space-x-2 bg-light-dark-blue/80 backdrop-blur-sm rounded-full px-4 py-2">
            <Heart className="w-4 h-4 text-accent-red" />
            <span className="text-off-white text-sm font-medium">
              {mockNgos.reduce((sum, ngo) => sum + ngo.volunteersNeeded, 0)} volunteers needed
            </span>
          </div>
        </div>
      </div>

      {/* Search Card Overlay */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 min-w-[400px] pointer-events-auto"
          ref={searchContainerRef}
        >
          {/* Search Input */}
          <div className="flex items-center space-x-2 mb-4 relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search NGOs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicks
                  setTimeout(() => {
                    setShowSuggestions(false);
                  }, 300);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
              />
              {/* Selected NGO Indicator */}
              {selectedNgo && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <Button className="bg-accent-red hover:bg-accent-red/90 text-white">
              Search
            </Button>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                {mockNgos
                  .filter(ngo => 
                    ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ngo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ngo.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5) // Show max 5 suggestions
                  .map((ngo) => (
                    <div
                      key={ngo.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSuggestionClick(ngo);
                      }}
                      className="px-3 py-2 hover:bg-accent-red/5 hover:border-l-4 hover:border-l-accent-red cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
                      data-ngo-id={ngo.id}
                    >
                      <div className="font-medium text-gray-900 group-hover:text-accent-red transition-colors">{ngo.name}</div>
                      <div className="text-sm text-gray-500 capitalize group-hover:text-accent-red/70 transition-colors">{ngo.category}</div>
                    </div>
                  ))}
                {mockNgos.filter(ngo => 
                  ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  ngo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  ngo.category.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    No NGOs found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Success Message */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md text-center"
            >
              <span className="text-green-700 text-sm">
                ✓ {selectedNgo?.name} selected! Details panel opened.
              </span>
            </motion.div>
          )}
          
          {/* Category Filter Pills */}
          <div className="flex items-center justify-center space-x-2">
            {['All', 'Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Animal Welfare'].map((category) => (
              <Button
                key={category}
                variant="secondary"
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className={`backdrop-blur-sm transition-all duration-300 shadow-card capitalize ${
                  selectedCategory === category 
                    ? 'bg-accent-red text-white hover:bg-accent-red/90' 
                    : 'bg-light-dark-blue/90 text-off-white hover:bg-accent-red hover:text-white'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* NGO Info Panel */}
      <AnimatePresence>
        {selectedNgo && (
          <NgoInfoPanel 
            ngo={selectedNgo} 
            isVisible={!!selectedNgo} 
            onClose={() => setSelectedNgo(null)} 
          />
        )}
      </AnimatePresence>

      {/* Floating Stats */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-red">{filteredNgos.length}</div>
            <div className="text-sm text-gray-600">
              {searchQuery || selectedCategory !== 'All' ? 'Filtered NGOs' : 'Total NGOs'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-red">
              {filteredNgos.reduce((sum, ngo) => sum + ngo.volunteersNeeded, 0)}
            </div>
            <div className="text-sm text-gray-600">Volunteers Needed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-red">
              {filteredNgos.filter(ngo => ngo.category === 'education').length}
            </div>
            <div className="text-sm text-gray-600">Education NGOs</div>
          </div>
        </div>
        
        {/* Search Results Indicator */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredNgos.length} of {mockNgos.length} NGOs
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setFilteredNgos(mockNgos);
              }}
              className="text-xs text-accent-red hover:text-accent-red/80 underline mt-1"
            >
              Clear filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Sliding Notification Stack */}
      <NotificationStack autoShowInterval={4000} maxNotifications={3} />
    </div>
  );
};

export default Explore;