import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check, AlertCircle, Mail, Lock, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/ParticleBackground';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength calculation
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[a-z]/.test(formData.password)) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic
      console.log('Login:', { email: formData.email, password: formData.password });
    } else {
      // Handle signup logic
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      console.log('Signup:', formData);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setFocusedField(null);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'text-red-400';
    if (passwordStrength <= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    return 'Strong';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <ParticleBackground />
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-white hover:bg-accent-red-hover transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Form Container */}
        <div className="bg-light-dark-blue/90 backdrop-blur-md border border-light-dark-blue/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-off-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join Ripple'}
            </h2>
            <p className="text-text-gray">
              {isLogin ? 'Continue your journey of making a difference' : 'Start your journey of making a difference'}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name (Sign Up only) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-dark-blue/50 border-b-2 border-text-gray/30 px-4 py-3 text-off-white placeholder-transparent focus:outline-none focus:border-accent-red transition-colors"
                      placeholder="Full Name"
                    />
                    <label
                      htmlFor="fullName"
                      className={`absolute left-4 transition-all duration-300 ${
                        focusedField === 'fullName' || formData.fullName
                          ? 'text-accent-red text-sm -top-2'
                          : 'text-text-gray text-base top-3'
                      }`}
                    >
                      Full Name
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-dark-blue/50 border-b-2 border-text-gray/30 px-4 py-3 text-off-white placeholder-transparent focus:outline-none focus:border-accent-red transition-colors"
                placeholder="Email"
              />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-300 ${
                  focusedField === 'email' || formData.email
                    ? 'text-accent-red text-sm -top-2'
                    : 'text-text-gray text-base top-3'
                }`}
              >
                Email
              </label>
              <Mail className="absolute right-4 top-3 w-5 h-5 text-text-gray" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-dark-blue/50 border-b-2 border-text-gray/30 px-4 py-3 text-off-white placeholder-transparent focus:outline-none focus:border-accent-red transition-colors"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all duration-300 ${
                  focusedField === 'password' || formData.password
                    ? 'text-accent-red text-sm -top-2'
                    : 'text-text-gray text-base top-3'
                }`}
              >
                Password
              </label>
              <Lock className="absolute right-12 top-3 w-5 h-5 text-text-gray" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-text-gray hover:text-off-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength (Sign Up only) */}
            <AnimatePresence mode="wait">
              {!isLogin && formData.password && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-gray">Password Strength:</span>
                    <span className={getPasswordStrengthColor()}>{getPasswordStrengthText()}</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength
                            ? passwordStrength <= 2
                              ? 'bg-red-400'
                              : passwordStrength <= 3
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                            : 'bg-text-gray/20'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Password (Sign Up only) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-dark-blue/50 border-b-2 border-text-gray/30 px-4 py-3 text-off-white placeholder-transparent focus:outline-none focus:border-accent-red transition-colors"
                      placeholder="Confirm Password"
                    />
                    <label
                      htmlFor="confirmPassword"
                      className={`absolute left-4 transition-all duration-300 ${
                        focusedField === 'confirmPassword' || formData.confirmPassword
                          ? 'text-accent-red text-sm -top-2'
                          : 'text-text-gray text-base top-3'
                      }`}
                    >
                      Confirm Password
                    </label>
                    <Shield className="absolute right-12 top-3 w-5 h-5 text-text-gray" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3 text-text-gray hover:text-off-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent-red/25"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>

            {/* Social Login */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-text-gray/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-light-dark-blue/90 text-text-gray">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-light-dark-blue/30 text-off-white hover:bg-light-dark-blue/30 hover:border-light-dark-blue/50 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Toggle Mode */}
            <motion.div
              key={isLogin ? 'login-toggle' : 'signup-toggle'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <button
                type="button"
                onClick={toggleMode}
                className="text-text-gray hover:text-accent-red transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-accent-red font-semibold">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </span>
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
