import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, Heart } from 'lucide-react';

const AuthChoicePage = () => {
  const navigate = useNavigate();

  const handleStudentChoice = () => {
    navigate('/student-login');
  };

  const handleNgoChoice = () => {
    navigate('/ngo-login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-12"
        >
          Join as a Student or an NGO
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Student Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)"
            }}
            className="bg-gray-800 rounded-2xl p-8 cursor-pointer border border-gray-700 hover:border-pink-500/50 transition-all duration-300"
            onClick={handleStudentChoice}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">I'm a Student</h2>
              <p className="text-gray-300 text-center">
                Join our community to find volunteering opportunities, track your impact, and connect with NGOs.
              </p>
            </div>
          </motion.div>

          {/* NGO Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)"
            }}
            className="bg-gray-800 rounded-2xl p-8 cursor-pointer border border-gray-700 hover:border-pink-500/50 transition-all duration-300"
            onClick={handleNgoChoice}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">I'm an NGO</h2>
              <p className="text-gray-300 text-center">
                Post opportunities, manage volunteers, and grow your impact in the community.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthChoicePage;
