import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EmergencyRequest {
  id: string;
  type: string;
  location: string;
  urgency: 'Critical' | 'High' | 'Medium';
  timePosted: string;
  description: string;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  // Dummy data for emergency requests
  const emergencyRequests: EmergencyRequest[] = [
    {
      id: '1',
      type: 'AB+ Blood Needed',
      location: 'PSG Hospital, Coimbatore',
      urgency: 'Critical',
      timePosted: '2 hours ago',
      description: 'Emergency surgery patient requires AB+ blood immediately. Contact hospital directly.'
    },
    {
      id: '2',
      type: 'O- Blood Donors',
      location: 'Ganga Hospital, Coimbatore',
      urgency: 'High',
      timePosted: '4 hours ago',
      description: 'Multiple trauma cases. Universal donors needed for emergency blood bank.'
    },
    {
      id: '3',
      type: 'B+ Blood Required',
      location: 'Kovai Medical Center',
      urgency: 'Medium',
      timePosted: '6 hours ago',
      description: 'Scheduled surgery tomorrow. Pre-donation requested.'
    },
    {
      id: '4',
      type: 'A+ Blood Needed',
      location: 'Sri Ramakrishna Hospital',
      urgency: 'High',
      timePosted: '8 hours ago',
      description: 'Cancer patient treatment. Regular donors welcome.'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-600 text-white';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return '🚨';
      case 'High':
        return '⚠️';
      case 'Medium':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-light-dark-blue rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-accent-red/20">
              {/* Header */}
              <div className="bg-gradient-to-r from-accent-red to-red-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">Urgent Community Needs</h2>
                      <p className="text-red-100">Emergency blood requests and urgent needs</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-4">
                  {emergencyRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * parseInt(request.id) }}
                      className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4 hover:bg-accent-red/20 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getUrgencyIcon(request.urgency)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{request.type}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                              <MapPin className="w-4 h-4" />
                              <span>{request.location}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{request.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{request.timePosted}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
                        >
                          Respond Now
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-4">
                      These are real community needs. Please respond only if you can genuinely help.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white"
                      >
                        Post Urgent Need
                      </Button>
                      <Button
                        onClick={onClose}
                        className="bg-accent-red hover:bg-accent-red-hover text-white px-8"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmergencyModal;
