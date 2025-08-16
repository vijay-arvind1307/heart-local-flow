import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MapPin, User, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/explore', label: 'Explore', icon: MapPin },
    { path: '/leaderboard', label: 'Leaderboard', icon: Award },
    { path: '/profile', label: 'Profile', icon: User },
  ];

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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openAuthModal('login')}
                className="text-text-gray hover:text-off-white hover:bg-light-dark-blue/30"
              >
                Sign In
              </Button>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="hero" 
                size="sm"
                className="bg-accent-red hover:bg-accent-red-hover text-white shadow-lg"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </>
  );
};

export default Navigation;
