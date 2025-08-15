import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check, AlertCircle, Mail, Lock, User, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/ParticleBackground';
import GoogleSignInButton from './GoogleSignInButton';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isGoogleSigningIn) return; // Prevent multiple submissions
    
    try {
      setIsSubmitting(true);
      
      if (isLogin) {
        // Handle login logic
        console.log('Login:', { email: formData.email, password: formData.password });
        // Add your login logic here
        toast({
          title: "Login successful",
          description: "Welcome back to Ripple!",
          variant: "default",
        });
        onClose();
        navigate('/profile');
      } else {
        // Handle signup logic
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match",
            variant: "destructive",
          });
          return;
        }
        console.log('Signup:', formData);
        // Add your signup logic here
        toast({
          title: "Account created!",
          description: "Welcome to Ripple!",
          variant: "default",
        });
        onClose();
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSigningIn(true);
      const provider = new GoogleAuthProvider();
      
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      
      // Successfully signed in
      console.log('Google Sign-In successful:', result.user);
      
      // Show success toast
      toast({
        title: "Welcome to Ripple!",
        description: `Signed in as ${result.user.displayName || result.user.email}`,
        variant: "default",
      });
      
      // Close the modal
      onClose();
      
      // Redirect to profile page
      navigate('/profile');
      
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "An error occurred during sign-in";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up was blocked. Please allow pop-ups for this site.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast({
        title: "Sign-in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleSigningIn(false);
    }
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
        className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
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
               disabled={isSubmitting}
               className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent-red/25 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSubmitting ? (
                 <div className="flex items-center justify-center">
                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                   {isLogin ? 'Signing In...' : 'Creating Account...'}
                 </div>
               ) : (
                 isLogin ? 'Sign In' : 'Create Account'
               )}
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
               
               <div className="space-y-2">
                 <GoogleSignInButton
                   onClick={handleGoogleSignIn}
                   disabled={isGoogleSigningIn}
                 />
                 
                 {/* Additional social login options can be added here */}
                 <p className="text-xs text-text-gray text-center">
                   By continuing, you agree to our Terms of Service and Privacy Policy
                 </p>
               </div>
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
