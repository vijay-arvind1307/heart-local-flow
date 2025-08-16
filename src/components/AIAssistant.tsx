import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue.trim()),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you with volunteering opportunities today?';
    }
    
    if (lowerMessage.includes('volunteer') || lowerMessage.includes('opportunity')) {
      return 'I can help you find volunteering opportunities! You can browse through our opportunities page or tell me what type of work you\'re interested in.';
    }
    
    if (lowerMessage.includes('points') || lowerMessage.includes('score')) {
      return 'You earn points by completing volunteer activities. Check your profile or the leaderboard to see your current score!';
    }
    
    if (lowerMessage.includes('badge') || lowerMessage.includes('achievement')) {
      return 'Badges are earned by completing specific milestones. Keep volunteering to unlock more achievements!';
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I\'m here to help! You can ask me about volunteering opportunities, how to earn points, or any other questions about the platform.';
    }
    
    return 'Thank you for your message! I\'m here to help you with volunteering opportunities and platform questions. Feel free to ask anything!';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    }
  };

  return (
    <>
             {/* Floating AI Assistant Button */}
       <motion.button
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={toggleChat}
         className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg p-4 bg-accent-red text-white hover:bg-accent-red-hover transition-all duration-300 hover:shadow-xl"
       >
        {isOpen ? (
          <Minimize2 className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-20 right-6 z-40 ${
              isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'
            } bg-light-dark-blue border border-border rounded-xl shadow-2xl overflow-hidden`}
          >
                         {/* Header */}
             <div className="bg-gradient-to-r from-accent-red to-accent-red-hover p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold">AI Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto h-[380px] space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                                                 className={`max-w-[80%] p-3 rounded-lg ${
                           message.sender === 'user'
                             ? 'bg-accent-red text-white'
                             : 'bg-input text-off-white'
                         }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'ai' && (
                            <Bot className="w-4 h-4 mt-0.5 text-accent-red flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm">{message.text}</p>
                                                         <p className={`text-xs mt-1 ${
                               message.sender === 'user' ? 'text-accent-red/80' : 'text-text-gray'
                             }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                                                     {message.sender === 'user' && (
                             <User className="w-4 h-4 mt-0.5 text-accent-red/80 flex-shrink-0" />
                           )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-input text-off-white p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-accent-red" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-text-gray rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-text-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-text-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-input border-border text-off-white placeholder:text-text-gray"
                      disabled={isLoading}
                    />
                                         <Button
                       onClick={handleSendMessage}
                       disabled={!inputValue.trim() || isLoading}
                       className="bg-accent-red hover:bg-accent-red-hover text-white px-3"
                     >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
