import React from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Clock, Award, Star, Trophy, Target, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Badge from '@/components/Badge';

const Profile = () => {
  const userStats = {
    name: "Alex Chen",
    level: "Community Champion",
    hoursVolunteered: 127,
    livesImpacted: 45,
    ngosHelped: 8,
    totalPoints: 1250,
    nextLevelPoints: 1500,
    joinDate: "March 2023"
  };

  const badges = [
    { id: 1, name: "First Timer", icon: "🌟", isEarned: true, description: "Completed first volunteer opportunity" },
    { id: 2, name: "Hunger Fighter", icon: "🍽️", isEarned: true, description: "Helped serve 100+ meals" },
    { id: 3, name: "Tree Planter", icon: "🌳", isEarned: true, description: "Planted 25+ trees" },
    { id: 4, name: "Mentor", icon: "🎓", isEarned: true, description: "Tutored students for 20+ hours" },
    { id: 5, name: "Night Owl", icon: "🌙", isEarned: false, description: "Complete 5 overnight volunteering shifts" },
    { id: 6, name: "Team Leader", icon: "👥", isEarned: false, description: "Lead a volunteer team of 10+ people" },
    { id: 7, name: "Marathon Helper", icon: "🏃", isEarned: false, description: "Volunteer for 24+ consecutive hours" },
    { id: 8, name: "Global Impact", icon: "🌍", isEarned: false, description: "Help NGOs in 5+ different countries" }
  ];

  const recentActivities = [
    {
      id: 1,
      activity: "Served meals at Community Food Bank",
      date: "2 days ago",
      impact: "Helped feed 32 families",
      points: 25
    },
    {
      id: 2,
      activity: "Tutored students at Youth Education Center",
      date: "1 week ago",
      impact: "Improved 3 students' math scores",
      points: 30
    },
    {
      id: 3,
      activity: "Planted trees with Urban Tree Initiative",
      date: "2 weeks ago",
      impact: "Planted 12 trees in Central Park",
      points: 20
    }
  ];

  const progressPercentage = (userStats.totalPoints / userStats.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-dark-blue/50 backdrop-blur-sm border-b border-light-dark-blue"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-off-white">Your Impact Dashboard</h1>
            <Button variant="outline" className="border-accent-red text-accent-red hover:bg-accent-red hover:text-white">
              Share Profile
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-card border-light-dark-blue shadow-elegant">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent-red to-accent-red-hover rounded-full flex items-center justify-center shadow-glow-red">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent-red rounded-full flex items-center justify-center border-2 border-dark-blue">
                    <span className="text-white text-xs font-bold">L3</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-off-white mb-2">{userStats.name}</h2>
                  <p className="text-accent-red font-semibold mb-4">{userStats.level}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-gray">Progress to next level</span>
                      <span className="text-off-white font-medium">{userStats.totalPoints}/{userStats.nextLevelPoints} points</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-text-gray">
                      {userStats.nextLevelPoints - userStats.totalPoints} points to "Impact Hero"
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-off-white">{userStats.totalPoints}</div>
                  <div className="text-text-gray text-sm">Total Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-card border-light-dark-blue shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-accent-red mx-auto mb-3" />
              <div className="text-3xl font-bold text-off-white mb-1">{userStats.hoursVolunteered}</div>
              <div className="text-text-gray">Hours Volunteered</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-light-dark-blue shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-accent-red mx-auto mb-3" />
              <div className="text-3xl font-bold text-off-white mb-1">{userStats.livesImpacted}</div>
              <div className="text-text-gray">Lives Impacted</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-light-dark-blue shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-accent-red mx-auto mb-3" />
              <div className="text-3xl font-bold text-off-white mb-1">{userStats.ngosHelped}</div>
              <div className="text-text-gray">NGOs Helped</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-card border-light-dark-blue shadow-card">
            <CardHeader>
              <CardTitle className="text-off-white flex items-center">
                <Award className="w-5 h-5 text-accent-red mr-2" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Badge badge={badge} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-card border-light-dark-blue shadow-card">
            <CardHeader>
              <CardTitle className="text-off-white flex items-center">
                <Calendar className="w-5 h-5 text-accent-red mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-light-dark-blue/50 rounded-lg hover:bg-light-dark-blue/70 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-accent-red rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="text-off-white font-medium">{activity.activity}</h4>
                        <p className="text-text-gray text-sm">{activity.impact}</p>
                        <p className="text-text-gray text-xs">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-accent-red font-bold">+{activity.points} pts</div>
                  </motion.div>
                ))}
              </div>
              
              <Button className="w-full mt-6 bg-accent-red hover:bg-accent-red-hover">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;