import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  BarChart3, 
  Calendar, 
  Users, 
  Settings,
  Plus,
  TrendingUp,
  Activity,
  Gift,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import QuickStats, { SummaryStats } from '@/components/QuickStats';
import ParticleBackground from '@/components/ParticleBackground';

const NgoDashboard = () => {
  return (
    <div className="min-h-screen bg-dark-blue text-off-white">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                NGO Dashboard
              </h1>
              <p className="text-text-gray">
                Manage your organization and track your impact
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-light-dark-blue text-off-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="hero" className="bg-accent-red hover:bg-accent-red-hover">
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6">
            <SummaryStats className="mb-4" />
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-light-dark-blue/50 border-light-dark-blue">
            <TabsTrigger value="overview" className="text-off-white">Overview</TabsTrigger>
            <TabsTrigger value="events" className="text-off-white">Events</TabsTrigger>
            <TabsTrigger value="volunteers" className="text-off-white">Volunteers</TabsTrigger>
            <TabsTrigger value="wishlist" className="text-off-white">Manage Wishlist</TabsTrigger>
            <TabsTrigger value="analytics" className="text-off-white">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Key Metrics</h2>
                                 <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-500/10">
                   <Activity className="w-3 h-3 mr-1" />
                   Live Data
                 </Badge>
              </div>
              <QuickStats />
            </motion.div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="border-2 border-emerald-400/30 bg-gradient-card hover:border-emerald-400/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { action: 'New volunteer joined', time: '2 hours ago', type: 'volunteer' },
                      { action: 'Event "Food Drive" completed', time: '1 day ago', type: 'event' },
                      { action: 'Received ₹500 donation', time: '2 days ago', type: 'donation' },
                      { action: 'New event "Tree Planting" created', time: '3 days ago', type: 'event' },
                                         ].map((item, index) => (
                       <motion.div 
                         key={index} 
                         className="flex items-center gap-3 p-3 bg-light-dark-blue/30 rounded-lg border border-gray-600/20 hover:border-gray-500/40 transition-all duration-200"
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ 
                           delay: 0.3 + index * 0.1,
                           duration: 0.4,
                           ease: "easeOut"
                         }}
                         whileHover={{ 
                           x: 5,
                           transition: { duration: 0.2 }
                         }}
                       >
                        <div className={`
                          w-3 h-3 rounded-full shadow-lg
                          ${item.type === 'volunteer' ? 'bg-emerald-400 shadow-emerald-400/50' : 
                            item.type === 'event' ? 'bg-cyan-400 shadow-cyan-400/50' : 'bg-amber-400 shadow-amber-400/50'}
                        `} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-off-white">{item.action}</p>
                          <p className="text-xs text-text-gray">{item.time}</p>
                                                 </div>
                       </motion.div>
                     ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="border-2 border-violet-400/30 bg-gradient-card hover:border-violet-400/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-violet-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Create New Event
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Users className="w-4 h-4 mr-2" />
                      Invite Volunteers
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Event Statistics</h2>
                <Button variant="hero" className="bg-accent-red hover:bg-accent-red-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
              <QuickStats showTrends={false} compact={true} />
            </motion.div>
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Volunteer Insights</h2>
                <Button variant="outline" className="border-light-dark-blue text-off-white">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Volunteers
                </Button>
              </div>
              <QuickStats showTrends={true} compact={false} />
            </motion.div>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Manage Wishlist</h2>
                <Badge variant="outline" className="border-orange-400 text-orange-400 bg-orange-500/10">
                  <Gift className="w-3 h-3 mr-1" />
                  In-Kind Donations
                </Badge>
              </div>
              
              {/* Current Wishlist Items */}
              <Card className="border-2 border-orange-400/30 bg-gradient-card hover:border-orange-400/60 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-400" />
                    Current Wishlist Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample wishlist items - will be replaced with Firestore data */}
                    <div className="flex items-center justify-between p-4 bg-light-dark-blue/50 rounded-lg border border-orange-400/20">
                      <div className="flex-1">
                        <h3 className="font-semibold text-off-white">Blankets</h3>
                        <p className="text-sm text-text-gray">Warm blankets for winter shelter</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-orange-400">Quantity: 50</span>
                          <span className="text-sm text-emerald-400">Pledged: 15</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-light-dark-blue/50 rounded-lg border border-orange-400/20">
                      <div className="flex-1">
                        <h3 className="font-semibold text-off-white">School Supplies</h3>
                        <p className="text-sm text-text-gray">Notebooks, pens, and backpacks</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-orange-400">Quantity: 100</span>
                          <span className="text-sm text-emerald-400">Pledged: 45</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add New Item Form */}
              <Card className="border-2 border-blue-400/30 bg-gradient-card hover:border-blue-400/60 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-400" />
                    Add New Wishlist Item
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemName" className="text-off-white">Item Name</Label>
                        <Input 
                          id="itemName" 
                          placeholder="e.g., Blankets, School Supplies"
                          className="bg-light-dark-blue border-light-dark-blue text-off-white placeholder:text-text-gray"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity" className="text-off-white">Quantity Needed</Label>
                        <Input 
                          id="quantity" 
                          type="number" 
                          placeholder="e.g., 50"
                          className="bg-light-dark-blue border-light-dark-blue text-off-white placeholder:text-text-gray"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-off-white">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Brief description of the item and why it's needed..."
                        rows={3}
                        className="bg-light-dark-blue border-light-dark-blue text-off-white placeholder:text-text-gray resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Detailed Analytics</h2>
                                 <Badge variant="outline" className="border-emerald-400 text-emerald-400 bg-emerald-500/10">
                   <TrendingUp className="w-3 h-3 mr-1" />
                   Growing
                 </Badge>
              </div>
              <QuickStats showTrends={true} compact={false} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NgoDashboard;
