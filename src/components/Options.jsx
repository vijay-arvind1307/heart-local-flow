import React from "react";
import "./Options.css";

const Options = (props) => {
  const options = [
    { text: "What is Ripple?", handler: props.actionProvider.handleWhatIsRipple, id: 1 },
    { text: "What's in it for students?", handler: props.actionProvider.handleForStudents, id: 2 },
    { text: "How does it help NGOs?", handler: props.actionProvider.handleForNGOs, id: 3 },
  ];

  const buttonsMarkup = options.map((option) => (
    <button key={option.id} onClick={option.handler} className="option-button">
      {option.text}
    </button>
  ));

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default Options;
