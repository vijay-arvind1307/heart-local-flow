import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { MapContainer as LeafletMap, Marker, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface NgoProfileEditorProps {
  ngoData: {
    ngoName?: string;
    description?: string;
    contactEmail?: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
}

export const NgoProfileEditor: React.FC<NgoProfileEditorProps> = ({ ngoData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ngoName: ngoData.ngoName || '',
    description: ngoData.description || '',
    contactEmail: ngoData.contactEmail || '',
    location: ngoData.location || { lat: 11.0168, lng: 76.9558 }, // Default to Coimbatore
  });
  
  const markerRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerDrag = () => {
    const marker = markerRef.current;
    if (marker) {
      const position = marker.getLatLng();
      setFormData(prev => ({
        ...prev,
        location: {
          lat: position.lat,
          lng: position.lng,
        },
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">NGO Name</label>
          <Input
            type="text"
            value={formData.ngoName}
            onChange={(e) => setFormData(prev => ({ ...prev, ngoName: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <Input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <div className="h-[300px] w-full rounded-md overflow-hidden border">
            <LeafletMap
              center={[formData.location.lat, formData.location.lng]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[formData.location.lat, formData.location.lng]}
                draggable={true}
                ref={markerRef}
                eventHandlers={{
                  dragend: handleMarkerDrag,
                }}
              />
            </LeafletMap>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};
