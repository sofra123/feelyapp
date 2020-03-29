import axios from "./axios";
import React from "react";
import Form from "./form";
import Chatbot from "./chatbot";
import PropTypes from "prop-types";
import ChatBot from "react-simple-chatbot";
export default class Sentimentscore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sentimentScore: props.sentimentScore
    };
  }

  render() {
    console.log(
      "THIS.props.sentimentScore in render",
      this.props.getSentimentScore()
    );

    return (
      <div className="background-users">
        <p>Your happiness score is : {this.props.getSentimentScore()}</p>
      </div>
    );
  }
}

// Sentimentscore.propTypes = {
//     steps: PropTypes.object
//   };

//   Sentimentscore.defaultProps = {
//     steps: undefined
//   };

// console.log("this.props.sentimentScore in render", this.props);
// if (!this.props.sentimentScore) {
//   return null;
// }

// const sentimentRank = this.props.sentimentScore;
