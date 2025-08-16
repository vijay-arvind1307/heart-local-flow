import { createChatBotMessage } from 'react-chatbot-kit';
import Options from '../components/Options'; // We'll create this next

const config = {
  botName: 'RippleBot',
  initialMessages: [
    createChatBotMessage("Hello! I'm RippleBot. I'm here to help you understand what our community is all about. What would you like to know?", {
      widget: 'learningOptions',
    }),
  ],
  widgets: [
    {
      widgetName: 'learningOptions',
      widgetFunc: (props) => <Options {...props} />,
    },
  ],
};

export default config;
