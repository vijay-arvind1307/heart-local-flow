import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Clock, 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Calendar,
  Filter,
  Crown,
  Zap,
  Heart,
  Users,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParticleBackground from '@/components/ParticleBackground';
import { auth } from '../firebase';
import { useToast } from '@/hooks/use-toast';

// Enhanced user interface with badges and achievements
interface User {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  volunteerHours: number;
  completedEvents: number;
  badges: string[];
  rank: number;
  level: number;
  streak: number;
}

// Badge definitions
const BADGES = {
  'first-event': { name: 'First Step', icon: '🎯', color: 'bg-blue-500' },
  'volunteer-10': { name: 'Dedicated Helper', icon: '🌟', color: 'bg-green-500' },
  'volunteer-50': { name: 'Community Hero', icon: '🏆', color: 'bg-yellow-500' },
  'volunteer-100': { name: 'Legendary Volunteer', icon: '👑', color: 'bg-purple-500' },
  'streak-7': { name: 'Week Warrior', icon: '🔥', color: 'bg-orange-500' },
  'streak-30': { name: 'Month Master', icon: '⚡', color: 'bg-red-500' },
  'referral-5': { name: 'Team Builder', icon: '🤝', color: 'bg-indigo-500' },
  'donation-100': { name: 'Generous Heart', icon: '💝', color: 'bg-pink-500' },
};

// Helper functions
const getLevelColor = (level: number) => {
  if (level >= 15) return 'text-purple-400';
  if (level >= 10) return 'text-blue-400';
  if (level >= 5) return 'text-green-400';
  return 'text-yellow-400';
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
    case 2: return <Medal className="w-6 h-6 text-gray-400" />;
    case 3: return <Trophy className="w-6 h-6 text-orange-400" />;
    default: return <span className="text-lg font-bold text-text-gray">{rank}</span>;
  }
};

// Mock data for development (replace with Firebase data)
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Elena Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    totalPoints: 2847,
    volunteerHours: 256,
    completedEvents: 42,
    badges: ['volunteer-100', 'streak-30', 'donation-100'],
    rank: 1,
    level: 15,
    streak: 45
  },
  {
    id: '2',
    name: 'Ben Carter',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    totalPoints: 2654,
    volunteerHours: 241,
    completedEvents: 38,
    badges: ['volunteer-50', 'streak-7', 'referral-5'],
    rank: 2,
    level: 14,
    streak: 12
  },
  {
    id: '3',
    name: 'Aisha Khan',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    totalPoints: 2489,
    volunteerHours: 228,
    completedEvents: 35,
    badges: ['volunteer-50', 'first-event'],
    rank: 3,
    level: 13,
    streak: 8
  },
  {
    id: '4',
    name: 'Marcus Chen',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    totalPoints: 2312,
    volunteerHours: 215,
    completedEvents: 32,
    badges: ['volunteer-10', 'streak-7'],
    rank: 4,
    level: 12,
    streak: 7
  },
  {
    id: '5',
    name: 'Sofia Petrova',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    totalPoints: 2187,
    volunteerHours: 198,
    completedEvents: 29,
    badges: ['volunteer-10'],
    rank: 5,
    level: 11,
    streak: 3
  },
  {
    id: '6',
    name: 'Liam Goldberg',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
    totalPoints: 1954,
    volunteerHours: 180,
    completedEvents: 26,
    badges: ['first-event'],
    rank: 6,
    level: 10,
    streak: 1
  },
  {
    id: '7',
    name: 'Chloe Dubois',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d',
    totalPoints: 1789,
    volunteerHours: 165,
    completedEvents: 23,
    badges: ['first-event'],
    rank: 7,
    level: 9,
    streak: 2
  },
  {
    id: '8',
    name: 'Raj Patel',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d',
    totalPoints: 1654,
    volunteerHours: 152,
    completedEvents: 20,
    badges: ['volunteer-10'],
    rank: 8,
    level: 8,
    streak: 5
  },
  {
    id: '9',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026712d',
    totalPoints: 1543,
    volunteerHours: 138,
    completedEvents: 18,
    badges: ['first-event'],
    rank: 9,
    level: 7,
    streak: 1
  },
  {
    id: '10',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026713d',
    totalPoints: 1432,
    volunteerHours: 125,
    completedEvents: 16,
    badges: ['volunteer-10'],
    rank: 10,
    level: 6,
    streak: 3
  }
];

// Current user data (replace with Firebase auth user)
const currentUser: User = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026702d',
  totalPoints: 847,
  volunteerHours: 42,
  completedEvents: 8,
  badges: ['first-event', 'volunteer-10'],
  rank: 58,
  level: 4,
  streak: 2
};

// Enhanced Podium Card Component
const PodiumCard = ({ user, colors, rankIconColor, isFirst = false }: {
  user: User;
  colors: string;
  rankIconColor: string;
  isFirst?: boolean;
}) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`relative ${colors} backdrop-blur-sm rounded-xl p-6 text-center border-2 shadow-lg flex flex-col items-center ${
      isFirst ? 'md:w-72 md:h-80' : 'md:w-64 md:h-72'
    }`}
  >
    {/* Crown for first place */}
    {isFirst && (
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <Crown className="w-8 h-8 text-yellow-400" />
      </div>
    )}

    {/* Avatar */}
    <Avatar className={`border-4 border-current mb-4 ${isFirst ? 'w-28 h-28' : 'w-24 h-24'}`}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className="bg-accent-red text-white font-bold text-lg">
        {user.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>

    {/* Name */}
    <h3 className={`font-bold mb-2 ${isFirst ? 'text-2xl' : 'text-xl'}`}>{user.name}</h3>

    {/* Level Badge */}
    <Badge variant="outline" className={`mb-3 ${getLevelColor(user.level)} border-current`}>
      Level {user.level}
    </Badge>

    {/* Points */}
    <div className={`flex items-center font-bold text-accent-red mb-2 ${isFirst ? 'text-2xl' : 'text-xl'}`}>
      <Star className="w-6 h-6 mr-2" />
      {user.totalPoints.toLocaleString()}
    </div>

    {/* Stats */}
    <div className="flex items-center gap-4 text-sm text-text-gray">
      <span className="flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        {user.volunteerHours}h
      </span>
      <span className="flex items-center">
        <Target className="w-4 h-4 mr-1" />
        {user.completedEvents}
      </span>
    </div>

    {/* Badges */}
    <div className="flex gap-1 mt-3 flex-wrap justify-center">
      {user.badges.slice(0, 2).map((badge) => (
        <Badge key={badge} className={`${BADGES[badge]?.color} text-white text-xs`}>
          {BADGES[badge]?.icon}
        </Badge>
      ))}
      {user.badges.length > 2 && (
        <Badge variant="outline" className="text-xs border-light-dark-blue text-text-gray">
          +{user.badges.length - 2}
        </Badge>
      )}
    </div>
  </motion.div>
);

const LeaderboardPage = () => {
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all-time'>('monthly');
  const [sortBy, setSortBy] = useState<'points' | 'hours' | 'events'>('points');
  const { toast } = useToast();

  // Filter and sort users based on selected criteria
  const getFilteredUsers = () => {
    let filtered = [...mockUsers];
    
    // Apply time filter (in real app, this would filter by date range)
    // For now, we'll just return the same data
    
    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.totalPoints - a.totalPoints;
        case 'hours':
          return b.volunteerHours - a.volunteerHours;
        case 'events':
          return b.completedEvents - a.completedEvents;
        default:
          return b.totalPoints - a.totalPoints;
      }
    });

    // Update ranks
    filtered.forEach((user, index) => {
      user.rank = index + 1;
    });

    return filtered;
  };

  const filteredUsers = getFilteredUsers();
  const topThree = filteredUsers.slice(0, 3);
  const restOfUsers = filteredUsers.slice(3);

  const podiumColors = {
    1: 'border-yellow-400 shadow-yellow-400/50 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20',
    2: 'border-gray-400 shadow-gray-400/50 bg-gradient-to-br from-gray-500/20 to-gray-600/20',
    3: 'border-orange-400 shadow-orange-400/50 bg-gradient-to-br from-orange-500/20 to-orange-600/20',
  };

  return (
    <div className="min-h-screen bg-dark-blue text-off-white">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Top <span className="text-accent-red">Changemakers</span>
          </h1>
          <p className="text-lg text-text-gray mb-8">
            See who's making the biggest ripple in our community
          </p>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-gray" />
              <span className="text-sm text-text-gray">Filter by:</span>
            </div>
            
            <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
              <SelectTrigger className="w-40 bg-light-dark-blue/50 border-light-dark-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-light-dark-blue border-light-dark-blue">
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40 bg-light-dark-blue/50 border-light-dark-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-light-dark-blue border-light-dark-blue">
                <SelectItem value="points">Sort by Points</SelectItem>
                <SelectItem value="hours">Sort by Hours</SelectItem>
                <SelectItem value="events">Sort by Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-12"
        >
          {/* Rank 2 */}
          <PodiumCard user={topThree[1]} colors={podiumColors[2]} rankIconColor="text-gray-400" />
          {/* Rank 1 */}
          <PodiumCard user={topThree[0]} colors={podiumColors[1]} rankIconColor="text-yellow-400" isFirst />
          {/* Rank 3 */}
          <PodiumCard user={topThree[2]} colors={podiumColors[3]} rankIconColor="text-orange-400" />
        </motion.div>

        {/* Leaderboard List (Ranks 4+) */}
        <div className="max-w-4xl mx-auto space-y-3 mb-20">
          {restOfUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
              className="flex items-center bg-gradient-card border border-light-dark-blue p-4 rounded-xl shadow-card hover:shadow-elegant transition-all duration-300"
            >
              {/* Rank */}
              <div className="w-12 text-center">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12 mx-4 border-2 border-light-dark-blue">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-accent-red text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-off-white">{user.name}</h3>
                  <Badge variant="outline" className={`text-xs ${getLevelColor(user.level)} border-current`}>
                    Level {user.level}
                  </Badge>
                  {user.streak > 0 && (
                    <Badge className="bg-orange-500 text-white text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {user.streak} day streak
                    </Badge>
                  )}
                </div>
                
                {/* Badges */}
                <div className="flex gap-1">
                  {user.badges.slice(0, 3).map((badge) => (
                    <Badge key={badge} className={`${BADGES[badge]?.color} text-white text-xs`}>
                      {BADGES[badge]?.icon} {BADGES[badge]?.name}
                    </Badge>
                  ))}
                  {user.badges.length > 3 && (
                    <Badge variant="outline" className="text-xs border-light-dark-blue text-text-gray">
                      +{user.badges.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="flex items-center text-lg font-bold text-accent-red mb-1">
                  <Star className="w-4 h-4 mr-1" />
                  {user.totalPoints.toLocaleString()}
                </div>
                <div className="flex items-center gap-4 text-sm text-text-gray">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {user.volunteerHours}h
                  </span>
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {user.completedEvents} events
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current User's Sticky Rank */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-20"
      >
        <Card className="bg-gradient-to-r from-accent-red to-accent-red-hover border-0 shadow-glow-red">
          <CardContent className="p-4">
            <div className="flex items-center">
              {/* Rank */}
              <div className="w-12 text-center">
                <span className="text-lg font-bold text-white">{currentUser.rank}</span>
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12 mx-4 border-2 border-white/50">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-white text-accent-red font-bold">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-white">{currentUser.name}</h3>
                  <Badge variant="outline" className="text-xs text-white border-white/50">
                    Level {currentUser.level}
                  </Badge>
                  {currentUser.streak > 0 && (
                    <Badge className="bg-white/20 text-white text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {currentUser.streak} day streak
                    </Badge>
                  )}
                </div>
                
                {/* Badges */}
                <div className="flex gap-1">
                  {currentUser.badges.map((badge) => (
                    <Badge key={badge} className="bg-white/20 text-white text-xs">
                      {BADGES[badge]?.icon} {BADGES[badge]?.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="flex items-center text-lg font-bold text-white mb-1">
                  <Star className="w-4 h-4 mr-1" />
                  {currentUser.totalPoints.toLocaleString()}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {currentUser.volunteerHours}h
                  </span>
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {currentUser.completedEvents} events
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
