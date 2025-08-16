class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleWhatIsRipple = () => {
    const message = this.createChatBotMessage(
      "Ripple Factor is a platform designed to connect student volunteers with local NGOs, making it easy to find meaningful opportunities and make a real impact."
    );
    this.addMessageToState(message);
  };

  handleForStudents = () => {
    const message = this.createChatBotMessage(
      "For students, we offer verified volunteering opportunities, a real-time blood donation network, and a gamified profile to track your social impact with points and badges."
    );
    this.addMessageToState(message);
  };

  handleForNGOs = () => {
    const message = this.createChatBotMessage(
      "We provide NGOs with direct access to a large, motivated pool of local volunteers, helping them find the support they need to achieve their missions."
    );
    this.addMessageToState(message);
  };

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;
