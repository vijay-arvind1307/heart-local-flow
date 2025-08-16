import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Building2, MapPin, Phone, Globe, Heart, Gift, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WishlistItem from '@/components/WishlistItem';
import ParticleBackground from '@/components/ParticleBackground';

interface WishlistItemData {
  id: string;
  itemName: string;
  description: string;
  quantityNeeded: number;
  quantityPledged: number;
  ngoId: string;
  ngoName: string;
}

interface NgoData {
  id: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  website: string;
  organizationType: string;
  foundedYear: number;
  volunteersCount: number;
  eventsCount: number;
  wishlist: WishlistItemData[];
}

const NgoProfilePage = () => {
  const { ngoId } = useParams<{ ngoId: string }>();
  const [ngoData, setNgoData] = useState<NgoData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from Firestore
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNgoData({
        id: ngoId || '1',
        name: 'Community Food Bank',
        description: 'We are dedicated to fighting hunger in our community by providing nutritious meals to families in need. Our mission is to ensure no one goes hungry and to build a stronger, more resilient community.',
        location: 'Coimbatore, Tamil Nadu',
        phone: '+91 98765 43210',
        website: 'https://communityfoodbank.org',
        organizationType: 'Non-Profit Organization',
        foundedYear: 2015,
        volunteersCount: 150,
        eventsCount: 45,
        wishlist: [
          {
            id: '1',
            itemName: 'Blankets',
            description: 'Warm blankets for winter shelter. We need these to help homeless families stay warm during cold nights.',
            quantityNeeded: 50,
            quantityPledged: 15,
            ngoId: ngoId || '1',
            ngoName: 'Community Food Bank'
          },
          {
            id: '2',
            itemName: 'School Supplies',
            description: 'Notebooks, pens, pencils, backpacks, and other essential school supplies for underprivileged children.',
            quantityNeeded: 100,
            quantityPledged: 45,
            ngoId: ngoId || '1',
            ngoName: 'Community Food Bank'
          },
          {
            id: '3',
            itemName: 'Hygiene Kits',
            description: 'Toothbrushes, toothpaste, soap, shampoo, and other personal hygiene items for families in need.',
            quantityNeeded: 75,
            quantityPledged: 20,
            ngoId: ngoId || '1',
            ngoName: 'Community Food Bank'
          },
          {
            id: '4',
            itemName: 'Baby Care Items',
            description: 'Diapers, baby food, formula, and other essential items for infants and toddlers.',
            quantityNeeded: 30,
            quantityPledged: 8,
            ngoId: ngoId || '1',
            ngoName: 'Community Food Bank'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [ngoId]);

  const handlePledgeUpdate = (itemId: string, newPledgedCount: number) => {
    if (ngoData) {
      setNgoData(prev => ({
        ...prev!,
        wishlist: prev!.wishlist.map(item =>
          item.id === itemId
            ? { ...item, quantityPledged: newPledgedCount }
            : item
        )
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-off-white text-xl">Loading NGO profile...</div>
      </div>
    );
  }

  if (!ngoData) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-off-white text-xl">NGO not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-blue text-off-white">
      <ParticleBackground />
      
      <div className="relative z-10 pt-20">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-dark-blue to-light-dark-blue border-b border-accent-red/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* NGO Logo */}
              <div className="w-24 h-24 bg-gradient-to-br from-accent-red to-red-600 rounded-2xl flex items-center justify-center shadow-glow-red">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              
              {/* NGO Info */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{ngoData.name}</h1>
                <p className="text-xl text-text-gray mb-4 max-w-3xl">{ngoData.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Badge variant="outline" className="border-accent-red text-accent-red bg-accent-red/10">
                    {ngoData.organizationType}
                  </Badge>
                  <Badge variant="outline" className="border-blue-400 text-blue-400 bg-blue-500/10">
                    Founded {ngoData.foundedYear}
                  </Badge>
                  <Badge variant="outline" className="border-emerald-400 text-emerald-400 bg-emerald-500/10">
                    {ngoData.volunteersCount} Volunteers
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact & Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Contact Info */}
            <Card className="bg-gradient-card border-light-dark-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-red" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-text-gray">
                  <MapPin className="w-4 h-4" />
                  <span>{ngoData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-text-gray">
                  <Phone className="w-4 h-4" />
                  <span>{ngoData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-text-gray">
                  <Globe className="w-4 h-4" />
                  <a href={ngoData.website} target="_blank" rel="noopener noreferrer" 
                     className="text-accent-red hover:underline">
                    {ngoData.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Impact Stats */}
            <Card className="bg-gradient-card border-light-dark-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent-red" />
                  Impact Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Volunteers</span>
                  <span className="text-2xl font-bold text-off-white">{ngoData.volunteersCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Events</span>
                  <span className="text-2xl font-bold text-off-white">{ngoData.eventsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Years Active</span>
                  <span className="text-2xl font-bold text-off-white">{new Date().getFullYear() - ngoData.foundedYear}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-card border-light-dark-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent-red" />
                  Get Involved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-accent-red hover:bg-accent-red-hover">
                  Volunteer Now
                </Button>
                <Button variant="outline" className="w-full border-accent-red text-accent-red hover:bg-accent-red hover:text-white">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Wishlist Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Gift className="w-8 h-8 text-accent-red" />
                Donation Wishlist
              </h2>
              <Badge variant="outline" className="border-orange-400 text-orange-400 bg-orange-500/10">
                {ngoData.wishlist.length} Items
              </Badge>
            </div>
            
            <p className="text-text-gray text-lg max-w-3xl">
              Support our mission by pledging to donate these essential items. Every contribution makes a difference in our community.
            </p>
          </div>

          {/* Wishlist Items */}
          <div className="space-y-6">
            {ngoData.wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <WishlistItem
                  {...item}
                  onPledgeUpdate={handlePledgeUpdate}
                />
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-card border-accent-red/30 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
                <p className="text-text-gray mb-6">
                  Your donations help us continue our mission. Every item counts towards building a stronger community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-accent-red hover:bg-accent-red-hover">
                    <Heart className="w-4 h-4 mr-2" />
                    Start Volunteering
                  </Button>
                  <Button variant="outline" className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Join Our Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NgoProfilePage;
