import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { NgoProfileEditor } from '../components/NgoProfileEditor';
import { EmergencyPostModal } from '../components/EmergencyPostModal';
import { AiPostGeneratorModal } from '../components/AiPostGeneratorModal';
import { MapPin, Users, Settings, AlertTriangle, Calendar, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample NGO data - hardcoded for immediate use
const sampleNgoData = {
  ngoName: "Siruthuli NGO",
  totalVolunteers: 47,
  opportunities: [
    {
      id: 1,
      title: "Tree Planting Drive",
      description: "Help us plant 1000 trees in Coimbatore city",
      createdAt: "2024-01-15",
      volunteersNeeded: 25,
      currentVolunteers: 18
    },
    {
      id: 2,
      title: "Beach Cleanup Initiative",
      description: "Clean Marina Beach and raise environmental awareness",
      createdAt: "2024-01-10",
      volunteersNeeded: 30,
      currentVolunteers: 22
    },
    {
      id: 3,
      title: "Educational Workshop",
      description: "Teach underprivileged children basic computer skills",
      createdAt: "2024-01-05",
      volunteersNeeded: 15,
      currentVolunteers: 12
    }
  ],
  recentPledges: 12,
  emergencyAlerts: 2,
  recentActivity: [
    {
      description: "New volunteer John Doe joined Tree Planting Drive",
      timestamp: "2024-01-16T10:30:00Z"
    },
    {
      description: "Emergency alert posted for blood donation",
      timestamp: "2024-01-15T15:45:00Z"
    },
    {
      description: "Beach Cleanup completed successfully",
      timestamp: "2024-01-14T18:20:00Z"
    }
  ]
};

export const NgoDashboardPage = () => {
  const navigate = useNavigate();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, {sampleNgoData.ngoName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Manage your opportunities and connect with volunteers</p>
        </div>
        <div className="space-x-4">
          <Button 
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/admin/create-post')}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Post New Opportunity
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            onClick={() => setIsAiModalOpen(true)}
          >
            <span className="text-xl mr-2">✨</span>
            Generate Post with AI
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setIsEmergencyModalOpen(true)}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Post Emergency Alert
          </Button>
        </div>
      </motion.div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            My Opportunities
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Edit Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Active Opportunities</h3>
                    <p className="text-3xl font-bold">{sampleNgoData.opportunities.length}</p>
                    <p className="text-blue-100 text-sm mt-1">Currently posted</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-200" />
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Total Volunteers</h3>
                    <p className="text-3xl font-bold">{sampleNgoData.totalVolunteers}</p>
                    <p className="text-green-100 text-sm mt-1">Students engaged</p>
                  </div>
                  <Users className="w-12 h-12 text-green-200" />
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Recent Pledges</h3>
                    <p className="text-3xl font-bold">{sampleNgoData.recentPledges}</p>
                    <p className="text-yellow-100 text-sm mt-1">This week</p>
                  </div>
                  <Heart className="w-12 h-12 text-yellow-200" />
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Emergency Alerts</h3>
                    <p className="text-3xl font-bold">{sampleNgoData.emergencyAlerts}</p>
                    <p className="text-red-100 text-sm mt-1">Active alerts</p>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-red-200" />
                </div>
              </Card>
            </motion.div>
          </div>
          
          {/* Quick Actions Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-3 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 w-full text-lg"
                  onClick={() => navigate('/explore')}
                >
                  <MapPin className="w-8 h-8 text-blue-600" />
                  <span>View All Opportunities</span>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-3 hover:bg-green-50 hover:border-green-300 transition-all duration-300 w-full text-lg"
                  onClick={() => navigate('/profile')}
                >
                  <Users className="w-8 h-8 text-green-600" />
                  <span>Manage Volunteers</span>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center space-y-3 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 w-full text-lg"
                  onClick={() => setActiveTab('profile')}
                >
                  <Settings className="w-8 h-8 text-purple-600" />
                  <span>Edit Public Profile</span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activity</h3>
            <div className="space-y-4">
              {sampleNgoData.recentActivity.map((activity, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 flex-1">{activity.description}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">My Opportunities</h2>
            <p className="text-gray-600">Manage and track your posted opportunities</p>
          </div>
          
          <div className="space-y-6">
            {sampleNgoData.opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{opportunity.title}</h3>
                      <p className="text-gray-600 mb-4">{opportunity.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>Posted: {new Date(opportunity.createdAt).toLocaleDateString()}</span>
                        <span>Volunteers: {opportunity.currentVolunteers}/{opportunity.volunteersNeeded}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center py-8"
            >
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/admin/create-post')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Create New Opportunity
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">Edit Profile</h2>
            <p className="text-gray-600">Update your NGO's public information and location</p>
          </div>
          
          <NgoProfileEditor ngoData={sampleNgoData} />
        </TabsContent>
      </Tabs>

      {/* Emergency Modal */}
      <EmergencyPostModal 
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* AI Post Generator Modal */}
      <AiPostGeneratorModal 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
