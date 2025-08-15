import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MapPin, User, ArrowRight, Globe, Users, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ParticleBackground from '@/components/ParticleBackground';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const features = [
    {
      icon: MapPin,
      title: "Discover NGOs Near You",
      description: "Find local organizations that need your help with our interactive map"
    },
    {
      icon: Heart,
      title: "Make Real Impact",
      description: "Track your volunteering hours and see the lives you've touched"
    },
    {
      icon: Award,
      title: "Earn Recognition",
      description: "Get badges and level up as you contribute to your community"
    },
    {
      icon: Users,
      title: "Join a Community",
      description: "Connect with like-minded volunteers and build lasting friendships"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Volunteers Connected" },
    { number: "500+", label: "Partner NGOs" },
    { number: "100,000+", label: "Lives Impacted" },
    { number: "25+", label: "Cities Covered" }
  ];

  const opportunities = [
    {
      id: 1,
      title: "Food Bank Volunteer",
      organization: "Community Food Bank",
      location: "Downtown Coimbatore",
      hours: "4 hours",
      date: "Tomorrow",
      category: "Hunger Relief",
      urgent: true
    },
    {
      id: 2,
      title: "Tree Planting",
      organization: "Green Earth Initiative",
      location: "Central Park",
      hours: "6 hours",
      date: "This Weekend",
      category: "Environment",
      urgent: false
    },
    {
      id: 3,
      title: "Student Tutoring",
      organization: "Youth Education Center",
      location: "North Campus",
      hours: "3 hours",
      date: "Next Week",
      category: "Education",
      urgent: true
    },
    {
      id: 4,
      title: "Animal Shelter Helper",
      organization: "Paws & Care",
      location: "West District",
      hours: "5 hours",
      date: "This Week",
      category: "Animal Welfare",
      urgent: false
    },
    {
      id: 5,
      title: "Senior Care Assistant",
      organization: "Golden Years Home",
      location: "East Side",
      hours: "4 hours",
      date: "Ongoing",
      category: "Healthcare",
      urgent: true
    }
  ];

  return (
    <div className="min-h-screen">
      <ParticleBackground />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-off-white mb-6 leading-tight">
              Make a
              <span className="text-accent-red"> Difference</span>
              <br />
              Today
            </h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-text-gray mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with local NGOs, track your impact, and join a community of changemakers. 
              Your next opportunity to help is just one click away.
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link to="/explore">
                <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore NGOs
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 border-light-dark-blue text-off-white hover:bg-light-dark-blue"
                >
                  <User className="w-5 h-5 mr-2" />
                  View Profile
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-light-dark-blue/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-card hover:shadow-elegant transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold text-accent-red mb-1">{stat.number}</div>
                <div className="text-sm text-text-gray">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Opportunities Section */}
      <div className="py-20 bg-dark-blue/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-off-white mb-6">
              New <span className="text-accent-red">Opportunities</span>
            </h2>
            <p className="text-xl text-text-gray max-w-3xl mx-auto">
              Discover fresh volunteering opportunities in your area
            </p>
          </motion.div>

          {/* Horizontal Scrolling Opportunity Cards */}
          <div className="relative">
            <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 scrollbar-hide px-2 md:px-0">
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="flex-shrink-0 w-72 md:w-80 bg-gradient-card border border-light-dark-blue rounded-xl shadow-card hover:shadow-elegant transition-all duration-300 opportunity-card"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-off-white mb-2">{opportunity.title}</h3>
                        <p className="text-accent-red font-medium mb-1">{opportunity.organization}</p>
                        <div className="flex items-center text-text-gray text-sm mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          {opportunity.location}
                        </div>
                      </div>
                      {opportunity.urgent && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-text-gray mb-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {opportunity.hours}
                      </span>
                      <span>{opportunity.date}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-gray bg-light-dark-blue px-2 py-1 rounded">
                        {opportunity.category}
                      </span>
                      <Button 
                        variant="hero" 
                        size="sm"
                        className="bg-accent-red hover:bg-accent-red-hover"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-dark-blue/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
                         <h2 className="text-4xl md:text-5xl font-bold text-off-white mb-6">
               How Ripple Works
             </h2>
            <p className="text-xl text-text-gray max-w-3xl mx-auto">
              Our platform makes it easy to find volunteering opportunities, 
              track your impact, and connect with your community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-gradient-card border-light-dark-blue shadow-card hover:shadow-elegant transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-accent-red" />
                    </div>
                    <h3 className="text-xl font-semibold text-off-white mb-3">{feature.title}</h3>
                    <p className="text-text-gray leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-off-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-text-gray mb-8 max-w-2xl mx-auto">
              Join thousands of volunteers already making a difference in their communities.
            </p>
            
            <Button 
              variant="hero" 
              size="lg" 
              className="text-xl px-12 py-6 animate-float"
              onClick={() => openAuthModal('signup')}
            >
              <Globe className="w-6 h-6 mr-3" />
              Start Volunteering Today
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-blue/80 border-t border-light-dark-blue py-12">
        <div className="max-w-7xl mx-auto px-4">
                     <div className="flex items-center justify-center space-x-2 mb-6">
             <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
               <Heart className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-bold text-off-white">Ripple</span>
           </div>
          
                     <div className="text-center text-text-gray">
             <p>&copy; 2024 Ripple. Making the world better, one volunteer at a time.</p>
           </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </div>
  );
};

export default Index;