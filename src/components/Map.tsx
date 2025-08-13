import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface NGO {
  id: number;
  name: string;
  position: [number, number];
  category: string;
  volunteersNeeded: number;
  description: string;
  address: string;
  contact: string;
  urgentNeeds: string[];
}

interface MapProps {
  ngos?: NGO[];
  onMarkerClick?: (ngo: NGO) => void;
}

const Map: React.FC<MapProps> = ({ ngos = [], onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Coimbatore city center coordinates
  const COIMBATORE_CENTER: [number, number] = [11.0168, 76.9558];

  // Sample Coimbatore NGOs (replace with your actual data)
  const coimbatoreNGOs: NGO[] = [
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

  // Use provided NGOs or fallback to Coimbatore NGOs
  const displayNGOs = ngos.length > 0 ? ngos : coimbatoreNGOs;

  const initializeMap = () => {
    if (!mapContainer.current || mapInitialized) return;

    try {
      // Initialize map centered on Coimbatore
      map.current = L.map(mapContainer.current).setView(COIMBATORE_CENTER, 12);

      // Add OpenStreetMap tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);

      // Add navigation controls
      const zoomControl = L.control.zoom({
        position: 'topright'
      });
      zoomControl.addTo(map.current);

      // Add scale control
      L.control.scale({
        position: 'bottomleft',
        metric: true,
        imperial: false
      }).addTo(map.current);

      // Add Coimbatore city boundary highlight
      const cityBoundary = L.rectangle([
        [10.9, 76.8],
        [11.2, 77.1]
      ], {
        color: '#EF4444',
        weight: 2,
        fillColor: '#EF4444',
        fillOpacity: 0.1
      }).addTo(map.current);

      // Add city label
      L.marker(COIMBATORE_CENTER)
        .bindPopup('<b>Coimbatore City</b><br/>Tamil Nadu, India')
        .addTo(map.current);

      setMapInitialized(true);
    } catch (error) {
      console.error('Error initializing Leaflet map:', error);
      alert('Error initializing map. Please try refreshing the page.');
    }
  };

  const addMarkers = () => {
    if (!map.current || !mapInitialized) return;

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });

    // Filter NGOs by category
    const filteredNGOs = selectedCategory === 'all' 
      ? displayNGOs 
      : displayNGOs.filter(ngo => ngo.category === selectedCategory);

    // Add markers for NGOs
    filteredNGOs.forEach((ngo) => {
      const marker = L.marker(ngo.position, {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: #EF4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(map.current!);

      // Add popup with NGO info
      const popup = L.popup({
        className: 'custom-popup',
        maxWidth: 300
      }).setContent(`
        <div class="p-3">
          <h3 class="font-semibold text-lg mb-2 text-gray-800">${ngo.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${ngo.description}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Category:</strong> ${ngo.category}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Volunteers needed:</strong> ${ngo.volunteersNeeded}</p>
          <p class="text-sm text-gray-600 mb-1"><strong>Address:</strong> ${ngo.address}</p>
          <p class="text-sm text-gray-600 mb-2"><strong>Contact:</strong> ${ngo.contact}</p>
          <div class="mb-2">
            <strong class="text-sm text-gray-600">Urgent needs:</strong>
            <div class="flex flex-wrap gap-1 mt-1">
              ${ngo.urgentNeeds.map(need => 
                `<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">${need}</span>`
              ).join('')}
            </div>
          </div>
          <button class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 w-full">
            View Details
          </button>
        </div>
      `);

      marker.bindPopup(popup);

      // Add click handler
      marker.on('click', () => {
        onMarkerClick?.(ngo);
      });
    });
  };

  const searchLocation = () => {
    if (!searchQuery.trim() || !map.current) return;

    // Search within Coimbatore area
    const searchQueryWithCity = `${searchQuery}, Coimbatore, Tamil Nadu`;
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQueryWithCity)}&limit=1&viewbox=76.8,10.9,77.1,11.2&bounded=1`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          
          map.current?.setView([lat, lon], 15);
          
          // Add a marker for the searched location
          L.marker([lat, lon])
            .addTo(map.current!)
            .bindPopup(`<b>${location.display_name}</b>`)
            .openPopup();
        } else {
          alert('Location not found in Coimbatore area. Please try a different search term.');
        }
      })
      .catch(error => {
        console.error('Error searching location:', error);
        alert('Error searching location. Please try again.');
      });
  };

  const categories = ['all', 'education', 'healthcare', 'environment', 'women', 'animals'];

  useEffect(() => {
    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        setMapInitialized(false);
      }
    };
  }, []);

  useEffect(() => {
    if (mapInitialized) {
      addMarkers();
    }
  }, [ngos, mapInitialized, selectedCategory]);

  return (
    <div className="relative w-full h-full">
      {/* Search and Filter Bar */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 flex flex-col gap-3 min-w-80">
        {/* Search */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search location in Coimbatore..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            className="flex-1"
          />
          <Button 
            onClick={searchLocation}
            className="bg-accent-red hover:bg-accent-red-hover text-white"
          >
            Search
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`text-xs capitalize ${
                selectedCategory === category 
                  ? 'bg-accent-red text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* NGO Count */}
        <div className="text-sm text-gray-600 text-center">
          {displayNGOs.filter(ngo => selectedCategory === 'all' || ngo.category === selectedCategory).length} NGOs found
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-dark-blue/10" />
    </div>
  );
};

export default Map;