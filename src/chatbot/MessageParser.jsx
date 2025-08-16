class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    // We'll leave this simple for now.
    console.log(message);
  }
}

export default MessageParser;
