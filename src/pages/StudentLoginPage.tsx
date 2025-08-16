import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile 
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface StudentFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  university: string;
  major: string;
  yearOfStudy: string;
}

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    university: '',
    major: '',
    yearOfStudy: ''
  });

  const [errors, setErrors] = useState<Partial<StudentFormData>>({});

  const yearOptions = [
    '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate Student'
  ];

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.studentId) {
        newErrors.studentId = 'Student ID is required';
      }
      if (!formData.university) {
        newErrors.university = 'University is required';
      }
      if (!formData.major) {
        newErrors.major = 'Major is required';
      }
      if (!formData.yearOfStudy) {
        newErrors.yearOfStudy = 'Year of study is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Handle login
        const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: `Signed in as ${result.user.email}`,
          variant: "default",
        });
        navigate('/profile');
      } else {
        // Handle signup
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Update profile with additional student information
        await updateProfile(result.user, {
          displayName: formData.fullName,
          photoURL: undefined
        });

        // TODO: Save additional student data to Firestore
        // This would include studentId, university, major, yearOfStudy
        
        toast({
          title: "Account created successfully!",
          description: `Welcome ${formData.fullName}! Your student account has been created.`,
          variant: "default",
        });
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = "An error occurred during authentication";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists. Please sign in.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: isLogin ? "Sign-in failed" : "Account creation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSigningIn(true);
      const provider = new GoogleAuthProvider();
      
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      
      toast({
        title: "Welcome to Ripple!",
        description: `Signed in as ${result.user.displayName || result.user.email}`,
        variant: "default",
      });
      
      navigate('/profile');
      
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      
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
      
      toast({
        title: "Sign-in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    if (isLogin) {
      // Switching to signup, clear password fields
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
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
      <div className="relative z-10 w-full max-w-2xl mx-auto">
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
          
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            {isLogin ? 'Student Login' : 'Student Sign Up'}
          </h1>
          <p className="text-gray-300 mb-8 text-center">
            {isLogin 
              ? 'Welcome back! Sign in to access your student dashboard and find volunteering opportunities.'
              : 'Join our community to find volunteering opportunities, track your impact, and connect with NGOs.'
            }
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        className={`pl-10 ${focusedField === 'fullName' ? 'border-pink-500' : ''} ${
                          errors.fullName ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Student ID */}
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-white">Student ID</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="Enter your student ID"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      onFocus={() => setFocusedField('studentId')}
                      onBlur={() => setFocusedField(null)}
                      className={`${focusedField === 'studentId' ? 'border-pink-500' : ''} ${
                        errors.studentId ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.studentId && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.studentId}
                      </p>
                    )}
                  </div>

                  {/* University and Major */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university" className="text-white">University</Label>
                      <Input
                        id="university"
                        type="text"
                        placeholder="Enter your university"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        onFocus={() => setFocusedField('university')}
                        onBlur={() => setFocusedField(null)}
                        className={`${focusedField === 'university' ? 'border-pink-500' : ''} ${
                          errors.university ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.university && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.university}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="major" className="text-white">Major</Label>
                      <Input
                        id="major"
                        type="text"
                        placeholder="Enter your major"
                        value={formData.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                        onFocus={() => setFocusedField('major')}
                        onBlur={() => setFocusedField(null)}
                        className={`${focusedField === 'major' ? 'border-pink-500' : ''} ${
                          errors.major ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.major && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.major}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-2">
                    <Label htmlFor="yearOfStudy" className="text-white">Year of Study</Label>
                    <select
                      id="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
                      onFocus={() => setFocusedField('yearOfStudy')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-pink-500 ${
                        focusedField === 'yearOfStudy' ? 'border-pink-500' : ''
                      } ${errors.yearOfStudy ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select year of study</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.yearOfStudy && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.yearOfStudy}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 ${focusedField === 'email' ? 'border-pink-500' : ''} ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 pr-10 ${focusedField === 'password' ? 'border-pink-500' : ''} ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password (only for signup) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="confirm-password"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 pr-10 ${focusedField === 'confirmPassword' ? 'border-pink-500' : ''} ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>

            {/* Google Sign-In */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSigningIn}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
              >
                {isGoogleSigningIn ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </div>
                )}
              </Button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-pink-400 font-semibold">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </span>
              </button>
            </div>
          </form>
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
