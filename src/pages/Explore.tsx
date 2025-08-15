import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NgoInfoPanel from '@/components/NgoInfoPanel';
import Map from '@/components/Map';
import NotificationStack from '@/components/NotificationStack';

// Updated NGO data structure to match the Map component
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

// Sample Coimbatore NGOs data
const mockNgos: NGO[] = [
  {
    id: 1,
    name: "Coimbatore Education Trust",
    description: "Providing quality education to underprivileged children in Coimbatore",
    position: [11.0168, 76.9558],
    category: "education",
    volunteersNeeded: 15,
    address: "RS Puram, Coimbatore",
    contact: "+91-422-1234567",
    urgentNeeds: ["Math tutors", "English teachers", "Computer instructors"]
  },
  {
    id: 2,
    name: "Coimbatore Healthcare Foundation",
    description: "Free medical camps and healthcare services for rural communities",
    position: [11.0189, 76.9565],
    category: "healthcare",
    volunteersNeeded: 20,
    address: "Peelamedu, Coimbatore",
    contact: "+91-422-2345678",
    urgentNeeds: ["Doctors", "Nurses", "Medical assistants"]
  },
  {
    id: 3,
    name: "Coimbatore Environmental Society",
    description: "Tree planting and environmental conservation in Coimbatore",
    position: [11.0147, 76.9541],
    category: "environment",
    volunteersNeeded: 12,
    address: "Saibaba Colony, Coimbatore",
    contact: "+91-422-3456789",
    urgentNeeds: ["Tree planters", "Environmental educators", "Cleanup volunteers"]
  },
  {
    id: 4,
    name: "Coimbatore Women Empowerment",
    description: "Skill development and empowerment programs for women",
    position: [11.0201, 76.9572],
    category: "women",
    volunteersNeeded: 18,
    address: "Race Course, Coimbatore",
    contact: "+91-422-4567890",
    urgentNeeds: ["Skill trainers", "Counselors", "Administrative support"]
  },
  {
    id: 5,
    name: "Coimbatore Animal Welfare",
    description: "Rescue and care for stray animals in Coimbatore",
    position: [11.0123, 76.9534],
    category: "animals",
    volunteersNeeded: 10,
    address: "Singanallur, Coimbatore",
    contact: "+91-422-5678901",
    urgentNeeds: ["Animal caretakers", "Veterinary assistants", "Fundraising volunteers"]
  }
];

const Explore = () => {
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);

  const handleMarkerClick = (ngo: NGO) => {
    setSelectedNgo(ngo);
  };

  return (
    <div className="relative w-full h-screen bg-dark-blue overflow-hidden">
      {/* Page Header */}
      <div className="pt-20 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-off-white hover:bg-light-dark-blue">
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
          
          {/* Category Filter Pills */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-3"
          >
            {['all', 'education', 'healthcare', 'environment', 'women', 'animals'].map((category) => (
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
        </div>
      </div>

      {/* Interactive Map Background */}
      <div className="relative flex-1">
        <Map ngos={mockNgos} onMarkerClick={handleMarkerClick} />
      </div>

      {/* NGO Info Panel */}
      <AnimatePresence>
        {selectedNgo && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-10"
          >
                         <NgoInfoPanel ngo={selectedNgo} isVisible={!!selectedNgo} onClose={() => setSelectedNgo(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Stats */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-red">{mockNgos.length}</div>
            <div className="text-sm text-gray-600">NGOs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-red">
              {mockNgos.reduce((sum, ngo) => sum + ngo.volunteersNeeded, 0)}
            </div>
            <div className="text-sm text-gray-600">Volunteers Needed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-red">
              {mockNgos.filter(ngo => ngo.category === 'education').length}
            </div>
            <div className="text-sm text-gray-600">Education NGOs</div>
          </div>
        </div>
      </motion.div>

      {/* Sliding Notification Stack */}
      <NotificationStack autoShowInterval={4000} maxNotifications={3} />
    </div>
  );
};

export default Explore;