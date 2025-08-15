import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/ParticleBackground';

// Mock data for the leaderboard
const mockUsers = [
  { id: 1, name: 'Elena Rodriguez', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', hours: 256, rank: 1 },
  { id: 2, name: 'Ben Carter', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', hours: 241, rank: 2 },
  { id: 3, name: 'Aisha Khan', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', hours: 228, rank: 3 },
  { id: 4, name: 'Marcus Chen', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', hours: 215, rank: 4 },
  { id: 5, name: 'Sofia Petrova', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', hours: 198, rank: 5 },
  { id: 6, name: 'Liam Goldberg', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', hours: 180, rank: 6 },
  { id: 7, name: 'Chloe Dubois', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026710d', hours: 165, rank: 7 },
  // ... add more users as needed
];

// Current user's data (for the sticky bar at the bottom)
const currentUser = { id: 123, name: 'You', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026702d', hours: 42, rank: 58 };

const LeaderboardPage = () => {
  const topThree = mockUsers.slice(0, 3);
  const restOfUsers = mockUsers.slice(3);

  const podiumColors = {
    1: 'border-yellow-400 shadow-yellow-400/50',
    2: 'border-gray-400 shadow-gray-400/50',
    3: 'border-orange-400 shadow-orange-400/50',
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
          <p className="text-lg text-text-gray">See who's making the biggest ripple this month.</p>
          <div className="mt-6 flex justify-center space-x-2">
            <Button variant="hero" size="sm">This Month</Button>
            <Button variant="outline" size="sm" className="border-light-dark-blue hover:bg-light-dark-blue">This Week</Button>
            <Button variant="outline" size="sm" className="border-light-dark-blue hover:bg-light-dark-blue">All Time</Button>
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
        <div className="max-w-3xl mx-auto space-y-3">
          {restOfUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
              className="flex items-center bg-light-dark-blue/50 backdrop-blur-sm p-3 rounded-lg shadow-card"
            >
              <span className="text-lg font-bold w-12 text-center text-text-gray">{user.rank}</span>
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4 border-2 border-light-dark-blue" />
              <span className="text-lg font-medium flex-grow">{user.name}</span>
              <div className="flex items-center text-lg font-semibold text-accent-red">
                <Clock className="w-5 h-5 mr-2" />
                {user.hours} hrs
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
        className="sticky bottom-4 w-full px-4 z-20"
      >
        <div className="max-w-3xl mx-auto flex items-center bg-accent-red p-3 rounded-lg shadow-lg text-white">
          <span className="text-lg font-bold w-12 text-center">{currentUser.rank}</span>
          <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full mr-4 border-2 border-white/50" />
          <span className="text-lg font-medium flex-grow">{currentUser.name}</span>
          <div className="flex items-center text-lg font-semibold">
            <Clock className="w-5 h-5 mr-2" />
            {currentUser.hours} hrs
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper component for the Top 3 Podium Cards
const PodiumCard = ({ user, colors, rankIconColor, isFirst = false }) => (
  <div className={`relative bg-light-dark-blue/80 backdrop-blur-sm rounded-xl p-6 text-center border-2 ${colors} shadow-lg flex flex-col items-center ${isFirst ? 'md:w-64 md:h-72' : 'md:w-56 md:h-64'}`}>
    <Trophy className={`w-10 h-10 absolute -top-5 ${rankIconColor}`} />
    <img src={user.avatarUrl} alt={user.name} className={`rounded-full border-4 ${colors} mb-4 ${isFirst ? 'w-24 h-24' : 'w-20 h-20'}`} />
    <h3 className={`font-bold text-xl mb-2 ${isFirst ? 'text-2xl' : 'text-xl'}`}>{user.name}</h3>
    <div className={`flex items-center font-bold text-accent-red ${isFirst ? 'text-2xl' : 'text-xl'}`}>
      <Clock className="w-6 h-6 mr-2" />
      {user.hours} hrs
    </div>
  </div>
);

export default LeaderboardPage;
