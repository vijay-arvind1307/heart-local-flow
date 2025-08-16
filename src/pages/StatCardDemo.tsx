import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Award,
  Star,
  Target,
  Activity
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import ParticleBackground from '@/components/ParticleBackground';

const StatCardDemo = () => {
  const demoStats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "247",
      label: "Total Volunteers",
      description: "Active community members",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-400/50"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      value: "12",
      label: "Active Events",
      description: "Ongoing opportunities",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-400/50"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: "1,847h",
      label: "Hours Contributed",
      description: "Volunteer time donated",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-400/50"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: "$15,420",
      label: "Donations Received",
      description: "Financial contributions",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-400/50"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      value: "892",
      label: "Beneficiaries Impacted",
      description: "Lives touched",
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-400/50"
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "156",
      label: "Events Completed",
      description: "Successful initiatives",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-400/50"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.8/5",
      label: "Average Rating",
      description: "Volunteer satisfaction",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-400/50"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "23%",
      label: "Monthly Growth",
      description: "Community expansion",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-400/50"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-blue text-off-white">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            StatCard Component Demo
          </h1>
          <p className="text-xl text-text-gray max-w-2xl mx-auto">
            Beautiful, animated stat cards with icon on top, bold title, and centered layout
          </p>
        </motion.div>

        {/* Demo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {demoStats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              color={stat.color}
              bgColor={stat.bgColor}
              borderColor={stat.borderColor}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Usage Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Usage */}
            <div className="bg-light-dark-blue/30 rounded-lg p-6 border border-gray-600/20">
              <h3 className="text-xl font-semibold mb-4">Basic Usage</h3>
              <div className="space-y-4">
                <StatCard
                  icon={<Target className="w-8 h-8" />}
                  value="1,139"
                  label="Total Impact"
                  description="Combined beneficiaries and volunteers"
                  delay={0}
                />
              </div>
            </div>

            {/* Custom Colors */}
            <div className="bg-light-dark-blue/30 rounded-lg p-6 border border-gray-600/20">
              <h3 className="text-xl font-semibold mb-4">Custom Colors</h3>
              <div className="space-y-4">
                <StatCard
                  icon={<Activity className="w-8 h-8" />}
                  value="Live"
                  label="Real-time Data"
                  description="Connected to Firebase"
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                  borderColor="border-green-400/50"
                  delay={0}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Code Example</h2>
          <div className="bg-light-dark-blue/30 rounded-lg p-6 border border-gray-600/20">
            <pre className="text-sm text-text-gray overflow-x-auto">
{`import StatCard from '@/components/StatCard';
import { Users } from 'lucide-react';

<StatCard
  icon={<Users className="w-8 h-8" />}
  value="247"
  label="Total Volunteers"
  description="Active community members"
  color="text-cyan-400"
  bgColor="bg-cyan-500/10"
  borderColor="border-cyan-400/50"
  delay={0}
/>`}
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatCardDemo;
