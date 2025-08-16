import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Activity,
  Target,
  Award,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import StatCard from './StatCard';

// Stats interface
interface NGOStats {
  volunteersCount: number;
  activeEvents: number;
  totalHours: number;
  donations: number;
  beneficiaries: number;
  completedEvents: number;
  averageRating: number;
  monthlyGrowth: number;
}

// Individual stat card interface
interface StatCard {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  suffix?: string;
  prefix?: string;
  trend?: number;
  description?: string;
}

// Mock data for development (replace with Firebase data)
const mockNGOStats: NGOStats = {
  volunteersCount: 247,
  activeEvents: 12,
  totalHours: 1847,
  donations: 15420,
  beneficiaries: 892,
  completedEvents: 156,
  averageRating: 4.8,
  monthlyGrowth: 23
};

// Fetch NGO stats from Firestore
const fetchNGOStats = async (ngoId: string): Promise<NGOStats> => {
  try {
    const ngoDoc = await getDoc(doc(db, 'ngos', ngoId));
    if (ngoDoc.exists()) {
      const data = ngoDoc.data();
      return {
        volunteersCount: data.volunteersCount || 0,
        activeEvents: data.activeEvents || 0,
        totalHours: data.totalHours || 0,
        donations: data.donations || 0,
        beneficiaries: data.beneficiaries || 0,
        completedEvents: data.completedEvents || 0,
        averageRating: data.averageRating || 0,
        monthlyGrowth: data.monthlyGrowth || 0
      };
    }
    return mockNGOStats; // Fallback to mock data
  } catch (error) {
    console.error('Error fetching NGO stats:', error);
    return mockNGOStats; // Fallback to mock data
  }
};

// Hook for fetching NGO stats
const useNGOStats = (ngoId: string) => {
  return useQuery({
    queryKey: ['ngoStats', ngoId],
    queryFn: () => fetchNGOStats(ngoId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!ngoId
  });
};

// QuickStats component
interface QuickStatsProps {
  ngoId?: string;
  className?: string;
  showTrends?: boolean;
  compact?: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({ 
  ngoId, 
  className = "",
  showTrends = true,
  compact = false
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Get current user for NGO ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Use provided ngoId or current user's NGO ID
  const effectiveNgoId = ngoId || currentUser?.uid;
  
  const { data: stats, isLoading, error } = useNGOStats(effectiveNgoId || 'mock');

  // Create stat cards from data
  const getStatCards = (stats: NGOStats) => [
    {
      id: 'volunteers',
      label: 'Total Volunteers',
      value: stats.volunteersCount,
      icon: <Users className="w-8 h-8" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-400/50',
      description: 'Active community members'
    },
    {
      id: 'activeEvents',
      label: 'Active Events',
      value: stats.activeEvents,
      icon: <Calendar className="w-8 h-8" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-400/50',
      description: 'Ongoing opportunities'
    },
    {
      id: 'totalHours',
      label: 'Hours Contributed',
      value: `${stats.totalHours}h`,
      icon: <Clock className="w-8 h-8" />,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-400/50',
      description: 'Volunteer time donated'
    },
    {
      id: 'donations',
      label: 'Donations Received',
      value: `₹${stats.donations.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-400/50',
      description: 'Financial contributions'
    },
    {
      id: 'beneficiaries',
      label: 'Beneficiaries Impacted',
      value: stats.beneficiaries,
      icon: <Heart className="w-8 h-8" />,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-400/50',
      description: 'Lives touched'
    },
    {
      id: 'completedEvents',
      label: 'Events Completed',
      value: stats.completedEvents,
      icon: <Award className="w-8 h-8" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-400/50',
      description: 'Successful initiatives'
    },
    {
      id: 'rating',
      label: 'Average Rating',
      value: `${stats.averageRating}/5`,
      icon: <Star className="w-8 h-8" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-400/50',
      description: 'Volunteer satisfaction'
    },
    {
      id: 'growth',
      label: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-400/50',
      description: 'Community expansion'
    }
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="border-light-dark-blue bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-text-gray mb-4">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Unable to load statistics</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-accent-red hover:text-accent-red-hover"
        >
          Try again
        </button>
      </div>
    );
  }

  const statCards = getStatCards(stats || mockNGOStats);

    return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {statCards.map((stat, index) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          description={stat.description}
          color={stat.color}
          bgColor={stat.bgColor}
          borderColor={stat.borderColor}
          delay={index * 0.08}
        />
      ))}
    </motion.div>
  );
};

// Summary stats component (for dashboard header)
export const SummaryStats: React.FC<QuickStatsProps> = ({ ngoId, className = "" }) => {
  const { data: stats } = useNGOStats(ngoId || 'mock');

  if (!stats) return null;

  const summaryCards = [
    {
      label: 'Total Impact',
      value: stats.beneficiaries + stats.volunteersCount,
      icon: <Target className="w-6 h-6" />,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      borderColor: 'border-rose-400/30'
    },
    {
      label: 'Active Projects',
      value: stats.activeEvents,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-400/30'
    },
    {
      label: 'Community Rating',
      value: `${stats.averageRating}/5`,
      icon: <Star className="w-6 h-6" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-400/30'
    }
  ];

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {summaryCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: index * 0.15,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={{ 
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          className={`flex items-center gap-3 ${stat.bgColor} ${stat.borderColor} border px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: index * 0.15 + 0.2,
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ 
              rotate: 360,
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
          >
            <div className={`w-5 h-5 ${stat.color}`}>
              {stat.icon}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index * 0.15 + 0.3,
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            <div className="text-sm text-text-gray">{stat.label}</div>
            <div className="font-bold text-off-white">
              {stat.value}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
