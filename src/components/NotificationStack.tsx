import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationStackProps {
  autoShowInterval?: number;
  maxNotifications?: number;
}

const NotificationStack: React.FC<NotificationStackProps> = ({ 
  autoShowInterval = 3000,
  maxNotifications = 3 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationId, setNotificationId] = useState(0);

  const sampleMessages = [
    "Did you see the latest NGO updates?",
    "A new volunteer opportunity is available",
    "Emergency relief efforts need your help!",
    "Your impact report is ready to view",
    "New educational programs launched"
  ];

  const addNotification = () => {
    const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newNotification: Notification = {
      id: notificationId,
      message,
      type
    };

    setNotifications(prev => {
      const updated = [...prev, newNotification];
      return updated.slice(-maxNotifications);
    });
    setNotificationId(prev => prev + 1);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const removeLastNotification = () => {
    setNotifications(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    const interval = setInterval(addNotification, autoShowInterval);
    return () => clearInterval(interval);
  }, [autoShowInterval, maxNotifications, notificationId]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-300 text-green-800';
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'error': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  return (
    <div 
      className="fixed top-8 left-8 z-50 space-y-2 cursor-pointer"
      onClick={removeLastNotification}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ 
              x: -400, 
              opacity: 0,
              scale: 0.8
            }}
            animate={{ 
              x: 0, 
              opacity: 1,
              scale: 1,
              y: index * -5 // Slight stacking offset
            }}
            exit={{ 
              x: -400, 
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.4 }
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              duration: 0.5
            }}
            className={`
              relative min-h-16 w-80 p-4 rounded-lg shadow-elegant
              font-medium tracking-wide select-none
              transform-gpu backdrop-blur-sm
              ${getNotificationColor(notification.type || 'info')}
              hover:scale-105 transition-transform duration-200
              border-l-4
            `}
            style={{
              fontFamily: "'Inter', sans-serif",
              zIndex: 1000 - index
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm leading-relaxed flex-1">
                {notification.message}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="text-current opacity-60 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/20"
              >
                <X size={14} />
              </button>
            </div>
            
            {/* Sticky note effect lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-current opacity-10"></div>
              <div className="absolute left-0 right-0 top-8 h-px bg-current opacity-10"></div>
              <div className="absolute left-0 right-0 top-12 h-px bg-current opacity-10"></div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationStack;