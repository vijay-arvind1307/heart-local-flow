import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MapPin, User, ArrowRight, Award, BookOpen, LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmergencyModal from './EmergencyModal';

import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after successful logout
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, redirect to home page
      navigate('/');
    }
  };

  // Navigation items based on authentication status
  const getNavItems = () => {
    if (user) {
      // User is logged in - show all navigation items
      return [
        { path: '/', label: 'Home', icon: Heart },
        { path: '/explore', label: 'Explore', icon: MapPin },
        { path: '/blog', label: 'Blog', icon: BookOpen },
        { path: '/leaderboard', label: 'Leaderboard', icon: Award },
        { path: '/ngo-dashboard', label: 'Dashboard', icon: Award },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    }

    // User is not logged in - show only Home and Sign In
    return [
      { path: '/', label: 'Home', icon: Heart },
    ];
  };

  const navItems = getNavItems();

  // Show loading state
  if (loading) {
    return (
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark-blue/80 backdrop-blur-md border-b border-light-dark-blue/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-off-white">Ripple</span>
            </div>
            
            {/* Loading skeleton */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="w-20 h-8 bg-light-dark-blue/30 rounded-lg animate-pulse"></div>
              <div className="w-20 h-8 bg-light-dark-blue/30 rounded-lg animate-pulse"></div>
            </div>
            
            <div className="w-24 h-9 bg-light-dark-blue/30 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark-blue/80 backdrop-blur-md border-b border-light-dark-blue/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-off-white">Ripple</span>
              </Link>
            </motion.div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-accent-red bg-accent-red/10 border border-accent-red/20'
                        : 'text-text-gray hover:text-off-white hover:bg-light-dark-blue/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
                             {/* Conditional Auth Buttons */}
               {!user && (
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => navigate('/get-started')}
                   className="text-text-gray hover:text-off-white hover:bg-light-dark-blue/30"
                 >
                   Sign In
                 </Button>
               )}

               {/* Emergency Button - Only for logged-in users */}
               {user && (
                 <motion.div
                   animate={{
                     scale: [1, 1.05, 1],
                   }}
                   transition={{
                     duration: 2,
                     repeat: Infinity,
                     ease: "easeInOut"
                   }}
                 >
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setEmergencyModalOpen(true)}
                     className="bg-accent-red hover:bg-accent-red-hover text-white border border-accent-red/50 shadow-lg hover:shadow-accent-red/25"
                   >
                     <AlertTriangle className="w-4 h-4 mr-2" />
                     Emergency
                   </Button>
                 </motion.div>
               )}
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <Button 
                  variant="hero" 
                  size="sm"
                  className="bg-accent-red hover:bg-accent-red-hover text-white shadow-lg"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-text-gray hover:text-accent-red hover:bg-accent-red/10 border border-accent-red/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
                 </div>
       </motion.nav>

       {/* Emergency Modal */}
       <EmergencyModal 
         isOpen={isEmergencyModalOpen} 
         onClose={() => setEmergencyModalOpen(false)} 
       />
     </>
   );
};

export default Navigation;
