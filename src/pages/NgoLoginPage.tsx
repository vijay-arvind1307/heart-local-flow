import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, ArrowLeft, Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, MapPin, Phone, Globe } from 'lucide-react';
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

interface NgoFormData {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  website: string;
  organizationType: string;
  description: string;
}

const NgoLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to profile
  const from = (location.state as any)?.from?.pathname || '/blog';
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<NgoFormData>({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactPerson: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    website: '',
    organizationType: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<NgoFormData>>({});

  const organizationTypes = [
    'Non-Profit Organization',
    'Charity',
    'Community Service',
    'Environmental Organization',
    'Educational Institution',
    'Healthcare Organization',
    'Animal Welfare',
    'Human Rights',
    'Disaster Relief',
    'Other'
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const handleInputChange = (field: keyof NgoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<NgoFormData> = {};

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
      if (!formData.organizationName) {
        newErrors.organizationName = 'Organization name is required';
      }
      if (!formData.contactPerson) {
        newErrors.contactPerson = 'Contact person is required';
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (!formData.address) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city) {
        newErrors.city = 'City is required';
      }
      if (!formData.state) {
        newErrors.state = 'State is required';
      }
      if (!formData.organizationType) {
        newErrors.organizationType = 'Organization type is required';
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
        navigate(from);
      } else {
        // Handle signup
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Update profile with additional NGO information
        await updateProfile(result.user, {
          displayName: formData.organizationName,
          photoURL: undefined
        });

        // TODO: Save additional NGO data to Firestore
        // This would include contactPerson, phoneNumber, address, city, state, website, organizationType, description
        
        toast({
          title: "Account created successfully!",
          description: `Welcome ${formData.organizationName}! Your NGO account has been created.`,
          variant: "default",
        });
        navigate(from);
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
    <div className="min-h-screen bg-dark-blue flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-red/20 to-accent-red-hover/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 76, 76, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 76, 76, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-light-dark-blue rounded-2xl p-8 border border-border shadow-card"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-red to-accent-red-hover rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-off-white mb-2 text-center">
            {isLogin ? 'NGO Login' : 'NGO Registration'}
          </h1>
          <p className="text-text-gray mb-8 text-center">
            {isLogin 
              ? 'Welcome back! Sign in to access your NGO dashboard and manage volunteering opportunities.'
              : 'Join our platform to post opportunities, manage volunteers, and grow your impact in the community.'
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
                  className="space-y-6"
                >
                  {/* Organization Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-off-white">Organization Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                        <Input
                          id="organizationName"
                          type="text"
                          placeholder="Enter organization name"
                          value={formData.organizationName}
                          onChange={(e) => handleInputChange('organizationName', e.target.value)}
                          onFocus={() => setFocusedField('organizationName')}
                          onBlur={() => setFocusedField(null)}
                          className={`pl-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'organizationName' ? 'border-accent-red' : ''} ${
                            errors.organizationName ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {errors.organizationName && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.organizationName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizationType" className="text-off-white">Organization Type *</Label>
                      <select
                        id="organizationType"
                        value={formData.organizationType}
                        onChange={(e) => handleInputChange('organizationType', e.target.value)}
                        onFocus={() => setFocusedField('organizationType')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-3 py-2 bg-input border border-border rounded-md text-off-white focus:outline-none focus:border-accent-red ${
                          focusedField === 'organizationType' ? 'border-accent-red' : ''
                        } ${errors.organizationType ? 'border-red-500' : ''}`}
                      >
                        <option value="" className="bg-input text-off-white">Select organization type</option>
                        {organizationTypes.map((type) => (
                          <option key={type} value={type} className="bg-input text-off-white">{type}</option>
                        ))}
                      </select>
                      {errors.organizationType && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.organizationType}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson" className="text-off-white">Contact Person *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                        <Input
                          id="contactPerson"
                          type="text"
                          placeholder="Enter contact person name"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          onFocus={() => setFocusedField('contactPerson')}
                          onBlur={() => setFocusedField(null)}
                          className={`pl-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'contactPerson' ? 'border-accent-red' : ''} ${
                            errors.contactPerson ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {errors.contactPerson && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.contactPerson}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-off-white">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Enter phone number"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          onFocus={() => setFocusedField('phoneNumber')}
                          onBlur={() => setFocusedField(null)}
                          className={`pl-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'phoneNumber' ? 'border-accent-red' : ''} ${
                            errors.phoneNumber ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-2">
                                          <Label htmlFor="address" className="text-off-white">Street Address *</Label>
                    <div className="relative">
                                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                                              <Input
                          id="address"
                          type="text"
                          placeholder="Enter street address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          onFocus={() => setFocusedField('address')}
                          onBlur={() => setFocusedField(null)}
                          className={`pl-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'address' ? 'border-accent-red' : ''} ${
                            errors.address ? 'border-red-500' : ''
                          }`}
                        />
                    </div>
                    {errors.address && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-off-white">City *</Label>
                                              <Input
                          id="city"
                          type="text"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          onFocus={() => setFocusedField('city')}
                          onBlur={() => setFocusedField(null)}
                          className={`bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'city' ? 'border-accent-red' : ''} ${
                            errors.city ? 'border-red-500' : ''
                          }`}
                        />
                      {errors.city && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-off-white">State *</Label>
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        onFocus={() => setFocusedField('state')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-3 py-2 bg-input border border-border rounded-md text-off-white focus:outline-none focus:border-accent-red ${
                          focusedField === 'state' ? 'border-accent-red' : ''
                        } ${errors.state ? 'border-red-500' : ''}`}
                      >
                        <option value="" className="bg-input text-off-white">Select state</option>
                        {states.map((state) => (
                          <option key={state} value={state} className="bg-input text-off-white">{state}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                                          <Label htmlFor="website" className="text-off-white">Website (Optional)</Label>
                    <div className="relative">
                                              <Globe className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://your-website.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        onFocus={() => setFocusedField('website')}
                        onBlur={() => setFocusedField(null)}
                        className={`pl-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'website' ? 'border-accent-red' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                                          <Label htmlFor="description" className="text-off-white">Organization Description (Optional)</Label>
                    <textarea
                      id="description"
                      placeholder="Brief description of your organization and mission..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                      rows={3}
                      className={`w-full px-3 py-2 bg-input border border-border rounded-md text-off-white focus:outline-none focus:border-accent-red resize-none placeholder:text-text-gray ${
                        focusedField === 'description' ? 'border-accent-red' : ''
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-off-white">Email *</Label>
              <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'email' ? 'border-accent-red' : ''} ${
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
              <Label htmlFor="password" className="text-off-white">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 pr-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'password' ? 'border-accent-red' : ''} ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-text-gray hover:text-off-white transition-colors"
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
                  <Label htmlFor="confirmPassword" className="text-off-white">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 pr-10 bg-input border-border text-off-white placeholder:text-text-gray ${focusedField === 'confirmPassword' ? 'border-accent-red' : ''} ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-text-gray hover:text-off-white transition-colors"
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
              className="w-full bg-gradient-to-r from-accent-red to-accent-red-hover hover:from-accent-red-hover hover:to-accent-red text-off-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-glow-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create NGO Account'
              )}
            </Button>

            {/* Google Sign-In */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-light-dark-blue text-text-gray">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSigningIn}
                variant="outline"
                className="w-full border-border text-off-white hover:bg-input hover:border-accent-red transition-all duration-300"
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
                className="text-text-gray hover:text-off-white transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-accent-red font-semibold">
                  {isLogin ? 'Register' : 'Sign In'}
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
          className="mt-8 flex items-center space-x-2 text-text-gray hover:text-off-white transition-colors duration-300 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Role Selection</span>
        </motion.button>
      </div>
    </div>
  );
};

export default NgoLoginPage;
