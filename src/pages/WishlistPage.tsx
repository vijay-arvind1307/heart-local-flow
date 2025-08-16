import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Search, Filter, MapPin, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  category: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - in real app, this would come from Firestore
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWishlistItems([
        {
          id: '1',
          itemName: 'Blankets',
          description: 'Warm blankets for winter shelter. We need these to help homeless families stay warm during cold nights.',
          quantityNeeded: 50,
          quantityPledged: 15,
          ngoId: '1',
          ngoName: 'Community Food Bank',
          category: 'Shelter',
          urgency: 'High'
        },
        {
          id: '2',
          itemName: 'School Supplies',
          description: 'Notebooks, pens, pencils, backpacks, and other essential school supplies for underprivileged children.',
          quantityNeeded: 100,
          quantityPledged: 45,
          ngoId: '1',
          ngoName: 'Community Food Bank',
          category: 'Education',
          urgency: 'Medium'
        },
        {
          id: '3',
          itemName: 'Hygiene Kits',
          description: 'Toothbrushes, toothpaste, soap, shampoo, and other personal hygiene items for families in need.',
          quantityNeeded: 75,
          quantityPledged: 20,
          ngoId: '2',
          ngoName: 'Health First Initiative',
          category: 'Health',
          urgency: 'High'
        },
        {
          id: '4',
          itemName: 'Baby Care Items',
          description: 'Diapers, baby food, formula, and other essential items for infants and toddlers.',
          quantityNeeded: 30,
          quantityPledged: 8,
          ngoId: '2',
          ngoName: 'Health First Initiative',
          category: 'Health',
          urgency: 'Critical'
        },
        {
          id: '5',
          itemName: 'Books and Toys',
          description: 'Children\'s books, educational toys, and games for community centers and orphanages.',
          quantityNeeded: 200,
          quantityPledged: 75,
          ngoId: '3',
          ngoName: 'Youth Development Center',
          category: 'Education',
          urgency: 'Low'
        },
        {
          id: '6',
          itemName: 'Medical Equipment',
          description: 'Wheelchairs, crutches, and other mobility aids for patients in need.',
          quantityNeeded: 15,
          quantityPledged: 3,
          ngoId: '4',
          ngoName: 'Disability Support Foundation',
          category: 'Health',
          urgency: 'Critical'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['all', 'Shelter', 'Education', 'Health', 'Food', 'Clothing'];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-600 text-white';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ngoName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePledgeUpdate = (itemId: string, newPledgedCount: number) => {
    setWishlistItems(prev => 
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantityPledged: newPledgedCount }
          : item
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-off-white text-xl">Loading wishlists...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-blue text-off-white">
      <ParticleBackground />
      
      <div className="relative z-10 pt-20">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-dark-blue to-light-dark-blue border-b border-accent-red/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-red to-red-600 rounded-2xl flex items-center justify-center shadow-glow-red">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">NGO Wishlists</h1>
              </div>
              <p className="text-xl text-text-gray max-w-3xl mx-auto">
                Discover items needed by NGOs in your community. Pledge to donate and make a difference today.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          <Card className="bg-gradient-card border-light-dark-blue mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-gray" />
                    <Input
                      placeholder="Search items, NGOs, or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-light-dark-blue border-light-dark-blue text-off-white placeholder:text-text-gray"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-text-gray" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-light-dark-blue border-light-dark-blue text-off-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-red"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-card border-light-dark-blue">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-off-white">{wishlistItems.length}</div>
                <div className="text-text-gray text-sm">Total Items</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-light-dark-blue">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-off-white">
                  {wishlistItems.filter(item => item.urgency === 'Critical').length}
                </div>
                <div className="text-text-gray text-sm">Critical Needs</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-light-dark-blue">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-off-white">
                  {wishlistItems.reduce((sum, item) => sum + item.quantityNeeded, 0)}
                </div>
                <div className="text-text-gray text-sm">Total Needed</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-light-dark-blue">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-off-white">
                  {wishlistItems.reduce((sum, item) => sum + item.quantityPledged, 0)}
                </div>
                <div className="text-text-gray text-sm">Total Pledged</div>
              </CardContent>
            </Card>
          </div>

          {/* Wishlist Items */}
          <div className="space-y-6">
            {filteredItems.length === 0 ? (
              <Card className="bg-gradient-card border-light-dark-blue">
                <CardContent className="p-12 text-center">
                  <Gift className="w-16 h-16 text-text-gray mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-off-white mb-2">No items found</h3>
                  <p className="text-text-gray">Try adjusting your search or category filter.</p>
                </CardContent>
              </Card>
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <div className="relative">
                    <WishlistItem
                      {...item}
                      onPledgeUpdate={handlePledgeUpdate}
                    />
                    {/* Category and Urgency Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge variant="outline" className="border-blue-400 text-blue-400 bg-blue-500/10">
                        {item.category}
                      </Badge>
                      <Badge className={getUrgencyColor(item.urgency)}>
                        {item.urgency}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
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
                  Every pledge counts towards building a stronger community. Start by pledging to donate items that matter to you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-accent-red hover:bg-accent-red-hover">
                    <Heart className="w-4 h-4 mr-2" />
                    Explore More NGOs
                  </Button>
                  <Button variant="outline" className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white">
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Local Opportunities
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

export default WishlistPage;
