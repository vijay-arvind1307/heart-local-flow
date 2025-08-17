import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, Copy, Sparkles, Check } from 'lucide-react';

interface AiPostGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiPostGeneratorModal: React.FC<AiPostGeneratorModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sample AI-generated content
  const sampleGeneratedContent = {
    title: "🌱 Join Our Tree Planting Drive at Ukkadam Lake - Make Coimbatore Greener!",
    description: `We're excited to invite passionate volunteers to our upcoming Tree Planting Drive at the beautiful Ukkadam Lake this Sunday morning! 

🌿 **What We'll Do:**
• Plant 100+ native saplings around the lake
• Learn about local biodiversity and conservation
• Create a lasting impact on our city's environment

📍 **Location:** Ukkadam Lake, Coimbatore
⏰ **Time:** Sunday, 7:00 AM - 11:00 AM
👥 **Volunteers Needed:** 25-30 people
🎯 **Goal:** Make Ukkadam Lake a green oasis for future generations

💚 **Why This Matters:**
Trees are our city's lungs, and every sapling we plant today will provide clean air, shade, and beauty for years to come. This is your chance to be part of something bigger than yourself!

🎁 **What You'll Get:**
• Free breakfast and refreshments
• Certificate of participation
• New friends who care about the environment
• The satisfaction of making a real difference

🚀 **No Experience Needed!** We'll provide all training and tools. Just bring your enthusiasm and love for nature.

Ready to make Coimbatore greener? Join us this Sunday and let's plant the seeds of a better tomorrow together! 🌱✨

#TreePlanting #Coimbatore #Environment #Volunteer #UkkadamLake #MakeADifference`
  };

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    
    setIsLoading(true);
    setGeneratedPost(null);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      setGeneratedPost(sampleGeneratedContent);
    }, 2000);
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClose = () => {
    setKeywords('');
    setGeneratedPost(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                AI Post Generator
              </DialogTitle>
              <p className="text-gray-300 mt-2">
                Let RippleBot help you create engaging, professional event descriptions from simple keywords
              </p>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              {/* Keywords Input */}
              <div className="space-y-3">
                <Label htmlFor="keywords" className="text-white font-medium">
                  Describe your event in keywords
                </Label>
                <Textarea
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., Tree planting, Ukkadam Lake, Sunday morning, environmental conservation, volunteers needed"
                  className="min-h-[100px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-400">
                  Be specific! Include event type, location, time, and key details for better results.
                </p>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!keywords.trim() || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    RippleBot is thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Post with AI
                  </>
                )}
              </Button>

              {/* Loading State */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center space-x-3 text-purple-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-lg font-medium">RippleBot is crafting your perfect post...</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    Analyzing keywords, understanding context, and generating engaging content...
                  </div>
                </motion.div>
              )}

              {/* Generated Content */}
              {generatedPost && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">AI Generation Complete!</span>
                    </div>
                    <p className="text-green-300 text-sm">
                      Your post has been generated with engaging content, proper formatting, and compelling call-to-action.
                    </p>
                  </div>

                  {/* Generated Title */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium flex items-center gap-2">
                      <span>Generated Title</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(generatedPost.title, 'title')}
                        className="h-6 px-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300"
                      >
                        {copiedField === 'title' ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedField === 'title' ? 'Copied!' : 'Copy'}
                      </Button>
                    </Label>
                    <Input
                      value={generatedPost.title}
                      readOnly
                      className="bg-gray-800 border-gray-600 text-white font-medium"
                    />
                  </div>

                  {/* Generated Description */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium flex items-center gap-2">
                      <span>Generated Description</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(generatedPost.description, 'description')}
                        className="h-6 px-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300"
                      >
                        {copiedField === 'description' ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedField === 'description' ? 'Copied!' : 'Copy'}
                      </Button>
                    </Label>
                    <Textarea
                      value={generatedPost.description}
                      readOnly
                      className="min-h-[300px] bg-gray-800 border-gray-600 text-white resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        handleCopy(generatedPost.title + '\n\n' + generatedPost.description, 'all');
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Content
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Generate Another Post
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Tips Section */}
              {!isLoading && !generatedPost && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 border border-gray-600 rounded-lg p-4"
                >
                  <h4 className="text-white font-medium mb-2">💡 Pro Tips for Better Results:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Include specific details like location, time, and date</li>
                    <li>• Mention the type of volunteers you need</li>
                    <li>• Add any special requirements or benefits</li>
                    <li>• Be clear about the impact and goals</li>
                  </ul>
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
