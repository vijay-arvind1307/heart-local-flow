import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapProps {
  ngos?: Array<{
    id: number;
    name: string;
    position: [number, number];
    category: string;
    volunteersNeeded: number;
  }>;
  onMarkerClick?: (ngo: any) => void;
}

const Map: React.FC<MapProps> = ({ ngos = [], onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    // Check if we have a token from Supabase Edge Function Secrets
    // In a real implementation, this would come from your backend
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      setShowTokenInput(false);
    }
  }, []);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    // Initialize map
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-74.006, 40.7128], // NYC coordinates
        zoom: 11,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add markers for NGOs
      ngos.forEach((ngo) => {
        const marker = new mapboxgl.Marker({
          color: '#EF4444', // Using accent-red color
        })
          .setLngLat([ngo.position[1], ngo.position[0]])
          .addTo(map.current!);

        // Add click handler
        marker.getElement().addEventListener('click', () => {
          onMarkerClick?.(ngo);
        });
      });

      // Store token for future use
      localStorage.setItem('mapbox_token', token);
      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      alert('Invalid Mapbox token. Please check your token and try again.');
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken.trim());
    }
  };

  useEffect(() => {
    if (!showTokenInput && mapboxToken) {
      initializeMap(mapboxToken);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [showTokenInput, mapboxToken, ngos]);

  if (showTokenInput) {
    return (
      <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="bg-light-dark-blue/90 backdrop-blur-sm rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-white text-lg font-semibold mb-4">Mapbox Token Required</h3>
          <p className="text-text-gray text-sm mb-4">
            Since this project uses Supabase, please add your Mapbox public token to the Supabase Edge Function Secrets. 
            For now, you can enter it here temporarily.
          </p>
          <p className="text-text-gray text-xs mb-4">
            Get your token from: <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-accent-red hover:underline">mapbox.com</a>
          </p>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-dark-blue/50 border-light-dark-blue text-off-white"
            />
            <Button 
              onClick={handleTokenSubmit}
              className="w-full bg-accent-red hover:bg-accent-red-hover text-white"
            >
              Initialize Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-dark-blue/10" />
    </div>
  );
};

export default Map;