import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface BadgeProps {
  badge: {
    id: number;
    name: string;
    icon: string;
    isEarned: boolean;
    description: string;
  };
}

const Badge: React.FC<BadgeProps> = ({ badge }) => {
  return (
    <motion.div
      whileHover={{ scale: badge.isEarned ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <div
        className={`
          w-16 h-16 rounded-full flex items-center justify-center text-2xl
          border-2 transition-all duration-300 shadow-card
          ${badge.isEarned 
            ? 'bg-gradient-to-br from-accent-red to-accent-red-hover border-accent-red shadow-glow-red' 
            : 'bg-light-dark-blue/50 border-text-gray/30 opacity-60'
          }
        `}
      >
        {badge.isEarned ? (
          <span className="filter drop-shadow-sm">{badge.icon}</span>
        ) : (
          <div className="relative">
            <span className="filter grayscale opacity-40">{badge.icon}</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-4 h-4 text-text-gray" />
            </div>
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ 
          opacity: 0, 
          y: 10, 
          scale: 0.9,
        }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none"
      >
        <div className="bg-dark-blue border border-light-dark-blue rounded-lg p-3 shadow-elegant max-w-48">
          <h4 className="text-off-white font-semibold text-sm mb-1">{badge.name}</h4>
          <p className="text-text-gray text-xs leading-relaxed">{badge.description}</p>
          {!badge.isEarned && (
            <div className="flex items-center mt-2 text-xs text-accent-red">
              <Lock className="w-3 h-3 mr-1" />
              <span>Not earned yet</span>
            </div>
          )}
        </div>
        
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-light-dark-blue"></div>
        </div>
      </motion.div>

      {/* Earned indicator */}
      {badge.isEarned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-accent-red rounded-full flex items-center justify-center border-2 border-dark-blue"
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Badge;