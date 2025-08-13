import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Users, Clock } from 'lucide-react';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import NgoInfoPanel from '@/components/NgoInfoPanel';

// Fix leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom NGO marker icon
const createNgoIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 24px; 
        height: 24px; 
        background-color: #ef4444; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex; 
        align-items: center; 
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

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
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-dark-blue to-transparent p-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
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
      </motion.div>

      {/* Map */}
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="relative z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {mockNgos.map((ngo) => {
          return (
            <Marker
              key={ngo.id}
              position={ngo.position}
              icon={createNgoIcon()}
              eventHandlers={{
                click: () => handleMarkerClick(ngo)
              }}
            >
              <Popup>
                <div className="text-center p-2">
                  <h3 className="font-bold text-dark-blue">{ngo.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{ngo.description}</p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-accent-red hover:bg-accent-red-hover"
                    onClick={() => handleMarkerClick(ngo)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

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