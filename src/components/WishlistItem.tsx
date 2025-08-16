import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../context/AuthContext';

interface WishlistItemProps {
  id: string;
  itemName: string;
  description: string;
  quantityNeeded: number;
  quantityPledged: number;
  ngoId: string;
  ngoName: string;
  onPledgeUpdate?: (itemId: string, newPledgedCount: number) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  id,
  itemName,
  description,
  quantityNeeded,
  quantityPledged,
  ngoId,
  ngoName,
  onPledgeUpdate
}) => {
  const { user } = useAuth();
  const [isPledged, setIsPledged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pledgeAnimation, setPledgeAnimation] = useState(false);

  // Calculate progress percentage
  const progressPercentage = Math.min((quantityPledged / quantityNeeded) * 100, 100);
  
  // Check if user is a student (not an NGO)
  const isStudent = user && !user.displayName?.includes('NGO');

  const handlePledge = async () => {
    if (!user || !isStudent) return;
    
    setIsUpdating(true);
    
    try {
      // TODO: Update Firestore with pledge
      // This would typically involve:
      // 1. Adding the pledge to the item's pledges array
      // 2. Updating the pledged count
      // 3. Recording the student's pledge
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setIsPledged(true);
      setPledgeAnimation(true);
      
      // Trigger progress bar animation
      if (onPledgeUpdate) {
        onPledgeUpdate(id, quantityPledged + 1);
      }
      
      // Reset animation after a delay
      setTimeout(() => setPledgeAnimation(false), 2000);
      
    } catch (error) {
      console.error('Error pledging item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-light-dark-blue rounded-xl p-6 border border-accent-red/20 hover:border-accent-red/40 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Item Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-accent-red" />
            <h3 className="text-xl font-bold text-off-white">{itemName}</h3>
          </div>
          
          <p className="text-text-gray mb-4">{description}</p>
          
          <div className="flex items-center gap-2 text-sm text-text-gray mb-3">
            <MapPin className="w-4 h-4" />
            <span>{ngoName}</span>
          </div>
          
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-gray">Progress</span>
              <span className="text-off-white font-medium">
                {quantityPledged} of {quantityNeeded} Pledged
              </span>
            </div>
            
            <motion.div
              animate={pledgeAnimation ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-light-dark-blue/50"
              />
            </motion.div>
            
            <div className="flex items-center justify-between text-xs text-text-gray">
              <span>0%</span>
              <span>{Math.round(progressPercentage)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        {/* Pledge Button */}
        <div className="flex-shrink-0">
          {isStudent ? (
            isPledged ? (
              <Button
                disabled
                className="bg-emerald-600 text-white cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Pledged ✓
              </Button>
            ) : (
              <Button
                onClick={handlePledge}
                disabled={isUpdating || quantityPledged >= quantityNeeded}
                className="bg-accent-red hover:bg-accent-red-hover text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    Pledging...
                  </>
                ) : (
                  'Pledge to Donate'
                )}
              </Button>
            )
          ) : (
            <div className="text-center">
              <div className="w-32 h-10 bg-gray-600/50 rounded-md flex items-center justify-center">
                <span className="text-sm text-gray-400">NGO Account</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Students can pledge</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Urgency Indicator */}
      {quantityPledged < quantityNeeded && (
        <div className="mt-4 pt-4 border-t border-accent-red/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-gray">
              Still need {quantityNeeded - quantityPledged} more
            </span>
            {quantityPledged < quantityNeeded * 0.3 && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                Urgent Need
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WishlistItem;
