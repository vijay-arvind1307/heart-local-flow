import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const StudentLoginPage = () => {
  const navigate = useNavigate();

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
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Student Login Page</h1>
          <p className="text-gray-300 mb-8">
            Welcome back! Sign in to access your student dashboard and find volunteering opportunities.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Login form will be implemented here</p>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={() => navigate('/get-started')}
          className="mt-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </motion.button>
      </div>
    </div>
  );
};

export default StudentLoginPage;
