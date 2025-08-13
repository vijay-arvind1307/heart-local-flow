import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NgoInfoPanel from '@/components/NgoInfoPanel';

// Mock NGO data
const mockNgos = [
  {
    id: 1,
    name: "Community Food Bank",
    description: "Fighting hunger in our local community through food distribution and education.",
    position: [40.7128, -74.0060] as [number, number],
    urgentNeeds: ["Food sorters", "Delivery drivers"],
    volunteersNeeded: 12,
    category: "hunger"
  },
  {
    id: 2,
    name: "Urban Tree Initiative",
    description: "Planting and maintaining urban green spaces to combat climate change.",
    position: [40.7580, -73.9855] as [number, number],
    urgentNeeds: ["Tree planters", "Maintenance crew"],
    volunteersNeeded: 8,
    category: "environment"
  },
  {
    id: 3,
    name: "Youth Education Center",
    description: "Providing after-school tutoring and mentorship for at-risk youth.",
    position: [40.6892, -74.0445] as [number, number],
    urgentNeeds: ["Math tutors", "Reading mentors"],
    volunteersNeeded: 15,
    category: "education"
  },
  {
    id: 4,
    name: "Homeless Support Network",
    description: "Providing shelter, meals, and support services for homeless individuals.",
    position: [40.7505, -73.9934] as [number, number],
    urgentNeeds: ["Night shift volunteers", "Social workers"],
    volunteersNeeded: 20,
    category: "homelessness"
  }
];

const Explore = () => {
  const [selectedNgo, setSelectedNgo] = useState<any>(null);

  const handleMarkerClick = (ngo: any) => {
    setSelectedNgo(ngo);
  };

  return (
    <div className="relative w-full h-screen bg-dark-blue overflow-hidden">
      {/* Header - Aligned at top */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-[1000] bg-dark-blue/95 backdrop-blur-sm border-b border-light-dark-blue"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-off-white hover:bg-light-dark-blue">
                <MapPin className="w-5 h-5 mr-2" />
                Explore NGOs
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
      </motion.div>

      {/* Map Placeholder - Testing */}
      <div className="relative z-0 w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Interactive Map</h2>
          <p className="text-gray-300">Map will be restored once compatibility issues are resolved</p>
          
          {/* Mock Markers as Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
            {mockNgos.slice(0, 4).map((ngo) => (
              <div 
                key={ngo.id}
                className="bg-light-dark-blue/90 rounded-lg p-3 cursor-pointer hover:bg-accent-red/20 transition-colors"
                onClick={() => handleMarkerClick(ngo)}
              >
                <h3 className="font-bold text-sm text-off-white">{ngo.name}</h3>
                <p className="text-xs text-text-gray mt-1">{ngo.category}</p>
                <div className="flex items-center mt-2 text-xs text-accent-red">
                  <Users className="w-3 h-3 mr-1" />
                  {ngo.volunteersNeeded} needed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[1000] space-y-2"
      >
        {['all', 'hunger', 'environment', 'education', 'homelessness'].map((category) => (
          <Button
            key={category}
            variant="secondary"
            size="sm"
            className="bg-light-dark-blue/90 backdrop-blur-sm text-off-white hover:bg-accent-red hover:text-white transition-all duration-300 shadow-card capitalize"
          >
            {category}
          </Button>
        ))}
      </motion.div>

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

      {/* Quick Stats */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]"
      >
        <div className="flex items-center space-x-4 bg-light-dark-blue/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-elegant">
          <div className="flex items-center space-x-2 text-off-white">
            <Users className="w-4 h-4 text-accent-red" />
            <span className="text-sm font-medium">{mockNgos.length} NGOs nearby</span>
          </div>
          <div className="w-px h-4 bg-text-gray"></div>
          <div className="flex items-center space-x-2 text-off-white">
            <Clock className="w-4 h-4 text-accent-red" />
            <span className="text-sm font-medium">2 urgent opportunities</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Explore;