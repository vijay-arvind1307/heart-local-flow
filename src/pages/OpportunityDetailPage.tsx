import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Heart, Mail, Phone, Calendar, Clock as ClockIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ParticleBackground from '@/components/ParticleBackground';
import { useToast } from '@/hooks/use-toast';

interface Opportunity {
  id: number;
  title: string;
  organization: string;
  location: string;
  hours: string;
  date: string;
  category: string;
  urgent: boolean;
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

const OpportunityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    availability: '',
    experience: '',
    motivation: '',
    preferredDate: ''
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockOpportunities: Opportunity[] = [
      {
        id: 1,
        title: "Food Bank Volunteer",
        organization: "Community Food Bank",
        location: "Downtown Coimbatore",
        hours: "4 hours",
        date: "Tomorrow",
        category: "Hunger Relief",
        urgent: true,
        description: "Help distribute food to families in need. This is a critical role that directly impacts our community's most vulnerable members.",
        requirements: ["No experience required", "Must be 16+ years old", "Comfortable with physical activity"],
        benefits: ["Make a direct impact", "Learn about food security", "Meet like-minded volunteers"]
      },
      {
        id: 2,
        title: "Tree Planting",
        organization: "Green Earth Initiative",
        location: "Central Park",
        hours: "6 hours",
        date: "This Weekend",
        category: "Environment",
        urgent: false,
        description: "Join us in planting native trees to improve air quality and create green spaces for future generations.",
        requirements: ["No experience required", "Must be 12+ years old", "Wear comfortable clothes"],
        benefits: ["Environmental impact", "Outdoor activity", "Learn about local ecology"]
      },
      {
        id: 3,
        title: "Student Tutoring",
        organization: "Youth Education Center",
        location: "North Campus",
        hours: "3 hours",
        date: "Next Week",
        category: "Education",
        urgent: true,
        description: "Provide academic support to students who need extra help with their studies.",
        requirements: ["Basic knowledge of subjects", "Patience and empathy", "Must be 18+ years old"],
        benefits: ["Help students succeed", "Develop teaching skills", "Flexible scheduling"]
      },
      {
        id: 4,
        title: "Animal Shelter Helper",
        organization: "Paws & Care",
        location: "West District",
        hours: "5 hours",
        date: "This Week",
        category: "Animal Welfare",
        urgent: false,
        description: "Assist with animal care, cleaning, and socializing with animals waiting for adoption.",
        requirements: ["Love for animals", "No experience required", "Must be 14+ years old"],
        benefits: ["Work with animals", "Learn animal care", "Help find homes for pets"]
      },
      {
        id: 5,
        title: "Senior Care Assistant",
        organization: "Golden Years Home",
        location: "East Side",
        hours: "4 hours",
        date: "Ongoing",
        category: "Healthcare",
        urgent: true,
        description: "Provide companionship and basic assistance to elderly residents.",
        requirements: ["Patience and compassion", "Good communication skills", "Must be 18+ years old"],
        benefits: ["Meaningful connections", "Learn about elder care", "Flexible hours"]
      }
    ];

    const foundOpportunity = mockOpportunities.find(opp => opp.id === parseInt(id || '1'));
    setOpportunity(foundOpportunity || mockOpportunities[0]);
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setApplicationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to your backend
    console.log('Application submitted:', {
      opportunity: opportunity?.title,
      ...applicationForm
    });

    toast({
      title: "Application Submitted!",
      description: `Your application for ${opportunity?.title} has been submitted successfully.`,
      variant: "default",
    });

    // Close modal and reset form
    setIsApplicationModalOpen(false);
    setApplicationForm({
      fullName: '',
      email: '',
      phone: '',
      availability: '',
      experience: '',
      motivation: '',
      preferredDate: ''
    });
  };

  const handleApplyNow = () => {
    setIsApplicationModalOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setApplicationForm({
      fullName: '',
      email: '',
      phone: '',
      availability: '',
      experience: '',
      motivation: '',
      preferredDate: ''
    });
  };

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-dark-blue text-off-white flex items-center justify-center">
        <div className="text-xl">Loading opportunity...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-blue text-off-white">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 border-light-dark-blue text-off-white hover:bg-light-dark-blue/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-text-gray bg-light-dark-blue px-2 py-1 rounded">
                  {opportunity.category}
                </span>
                {opportunity.urgent && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Urgent
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {opportunity.title}
              </h1>
              
              <p className="text-xl text-text-gray mb-6">
                {opportunity.organization}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-text-gray">
                  <MapPin className="w-5 h-5 mr-2" />
                  {opportunity.location}
                </div>
                <div className="flex items-center text-text-gray">
                  <Clock className="w-5 h-5 mr-2" />
                  {opportunity.hours}
                </div>
                <div className="flex items-center text-text-gray">
                  <Calendar className="w-5 h-5 mr-2" />
                  {opportunity.date}
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <Button 
                onClick={handleApplyNow}
                size="lg"
                className="w-full bg-accent-red hover:bg-accent-red-hover text-lg py-6 shadow-glow-red"
              >
                <Heart className="w-6 h-6 mr-2" />
                Apply Now
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">About This Opportunity</h2>
              <p className="text-text-gray leading-relaxed">
                {opportunity.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {opportunity.requirements?.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-accent-red rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-text-gray">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">What You'll Gain</h2>
              <ul className="space-y-2">
                {opportunity.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-text-gray">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-light-dark-blue/30 rounded-xl p-6 border border-light-dark-blue">
              <h3 className="text-xl font-semibold mb-4">Quick Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Organization</span>
                  <span className="font-medium">{opportunity.organization}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Location</span>
                  <span className="font-medium">{opportunity.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Duration</span>
                  <span className="font-medium">{opportunity.hours}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Date</span>
                  <span className="font-medium">{opportunity.date}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-gray">Category</span>
                  <span className="font-medium">{opportunity.category}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-light-dark-blue">
                <Button 
                  onClick={handleApplyNow}
                  className="w-full bg-accent-red hover:bg-accent-red-hover"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isApplicationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-blue border-2 border-light-dark-blue rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Apply for {opportunity.title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeApplicationModal}
                  className="text-text-gray hover:text-off-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-off-white text-sm font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={applicationForm.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="bg-light-dark-blue/50 border-light-dark-blue text-off-white placeholder:text-text-gray focus:border-accent-red"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-off-white text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="bg-light-dark-blue/50 border-light-dark-blue text-off-white placeholder:text-text-gray focus:border-accent-red"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-off-white text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={applicationForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="bg-light-dark-blue/50 border-light-dark-blue text-off-white placeholder:text-text-gray focus:border-accent-red"
                  />
                </div>

                <div>
                  <Label htmlFor="availability" className="text-off-white text-sm font-medium">Availability *</Label>
                  <Input
                    id="availability"
                    type="text"
                    value={applicationForm.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    placeholder="When are you available to volunteer?"
                    required
                    className="bg-light-dark-blue/50 border-light-dark-blue text-off-white placeholder:text-text-gray focus:border-accent-red"
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-off-white text-sm font-medium">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe any relevant experience you have..."
                    value={applicationForm.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    rows={3}
                    className="bg-light-dark-blue/50 border-light-dark-blue text-off-white placeholder:text-text-gray focus:border-accent-red resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="motivation" className="text-off-white text-sm font-medium">Why do you want to volunteer? *</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Tell us about your motivation and what you hope to achieve..."
                    value={applicationForm.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    rows={3}
                    required
                    className="bg-light-dark-blue/50 border-light-dark-blue text-off-white placeholder:text-text-gray focus:border-accent-red resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredDate" className="text-off-white text-sm font-medium">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={applicationForm.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    required
                    className="bg-light-dark-blue/50 border-light-dark-blue text-off-white placeholder:text-text-gray focus:border-accent-red"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full text-lg px-8 py-4 bg-accent-red hover:bg-accent-red-hover shadow-glow-red"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpportunityDetailPage;
