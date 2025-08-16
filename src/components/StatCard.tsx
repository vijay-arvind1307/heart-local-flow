import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  description?: string;
  className?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  description,
  className = "",
  color = "text-cyan-400",
  bgColor = "bg-cyan-500/10",
  borderColor = "border-cyan-400/50",
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={className}
    >
      <Card className={`
        ${borderColor} bg-gradient-card hover:shadow-elegant 
        transition-all duration-300 cursor-pointer group border-2
        hover:shadow-2xl hover:scale-105
        p-6
      `}>
        <CardContent className="p-0 text-center">
          {/* Icon Container */}
          <motion.div 
            className={`
              p-4 rounded-xl ${bgColor} ${borderColor} border-2
              shadow-lg backdrop-blur-sm mx-auto mb-4 w-16 h-16
              flex items-center justify-center
            `}
            whileHover={{ 
              scale: 1.15,
              rotate: 5,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: delay + 0.2,
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            <div className={`w-8 h-8 ${color}`}>
              {icon}
            </div>
          </motion.div>

          {/* Value */}
          <motion.div 
            className="mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: delay + 0.4,
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            <div className="text-3xl font-bold text-off-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          </motion.div>

          {/* Label */}
          <motion.h3 
            className="text-lg font-semibold text-off-white mb-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: delay + 0.5,
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            {label}
          </motion.h3>

          {/* Description */}
          {description && (
            <motion.p 
              className="text-sm text-text-gray"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: delay + 0.6,
                duration: 0.4,
                ease: "easeOut"
              }}
            >
              {description}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
