import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../chatbot/config.jsx';
import MessageParser from '../chatbot/MessageParser.jsx';
import ActionProvider from '../chatbot/ActionProvider.jsx';

const ChatbotWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Avatar Button */}
      <button
        onClick={toggleChat}
        className="w-16 h-16 rounded-full bg-accent-red hover:bg-accent-red-hover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
      >
        <img
          src="/RippleBot.png"
          alt="RippleBot"
          className="w-full h-full rounded-full object-cover"
        />
      </button>

      {/* Conditional Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-20 right-0"
          >
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;
