import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface EmergencyPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyPostModal: React.FC<EmergencyPostModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'emergencies'), {
        message: message.trim(),
        ngoId: user.uid,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      onClose();
      setMessage('');
    } catch (error) {
      console.error('Error posting emergency:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-600">
                Post an Urgent Alert
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the emergency situation..."
                required
                className="min-h-[150px]"
              />
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Now'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
