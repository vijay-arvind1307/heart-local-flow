import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Clock, Heart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NgoInfoPanelProps {
  ngo: {
    id: number;
    name: string;
    description: string;
    urgentNeeds: string[];
    volunteersNeeded: number;
    category: string;
  };
  isVisible: boolean;
  onClose: () => void;
}

const NgoInfoPanel: React.FC<NgoInfoPanelProps> = ({ ngo, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-blue/80 backdrop-blur-sm z-[2000]"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200
            }}
            className="fixed bottom-0 left-0 right-0 z-[2001] max-h-[80vh] overflow-hidden"
          >
            <Card className="bg-gradient-card border-t-4 border-t-accent-red rounded-t-3xl rounded-b-none shadow-elegant">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-text-gray rounded-full mx-auto mt-3 opacity-50"></div>
              
              <CardContent className="p-6 pb-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-off-white">{ngo.name}</h2>
                      <Badge variant="secondary" className="bg-accent-red/20 text-accent-red border-accent-red/30 capitalize">
                        {ngo.category}
                      </Badge>
                    </div>
                    <p className="text-text-gray leading-relaxed">{ngo.description}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-text-gray hover:text-off-white hover:bg-light-dark-blue ml-4"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-light-dark-blue/50 rounded-lg">
                    <Users className="w-5 h-5 text-accent-red" />
                    <div>
                      <div className="text-lg font-bold text-off-white">{ngo.volunteersNeeded}</div>
                      <div className="text-xs text-text-gray">Volunteers Needed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-light-dark-blue/50 rounded-lg">
                    <Clock className="w-5 h-5 text-accent-red" />
                    <div>
                      <div className="text-lg font-bold text-off-white">Urgent</div>
                      <div className="text-xs text-text-gray">Priority Level</div>
                    </div>
                  </div>
                </div>

                {/* Urgent Needs */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-off-white mb-3 flex items-center">
                    <Heart className="w-5 h-5 text-accent-red mr-2" />
                    Urgent Needs
                  </h3>
                  <div className="space-y-2">
                    {ngo.urgentNeeds.map((need, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-light-dark-blue/30 rounded-lg hover:bg-light-dark-blue/50 transition-colors cursor-pointer group"
                      >
                        <span className="text-off-white">{need}</span>
                        <ChevronRight className="w-4 h-4 text-text-gray group-hover:text-accent-red transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-semibold py-6 text-lg shadow-glow-red"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Volunteer Now
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="border-light-dark-blue text-off-white hover:bg-light-dark-blue py-3"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-light-dark-blue text-off-white hover:bg-light-dark-blue py-3"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NgoInfoPanel;