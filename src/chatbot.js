import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import axios from "axios";
import Sentimentscore from "./sentimentscore";
import Sentimentchart from "./sentimentchart";
import { Link } from "react-router-dom";

export default class Chatbot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sentimentScore: "Calculating..."
    };

    this.handleEnd = this.handleEnd.bind(this);
    this.getSentimentScore = this.getSentimentScore.bind(this);
  }

  componentDidMount() {}

  handleEnd({ steps, values }) {
    console.log("steps from chatbot", steps);
    console.log("values from chatbot", values);

    // alert(`Chat handleEnd callback! Number: ${values[0]}`);

    let values2 = {
      answer_1: values[0],
      answer_2: values[1],
      answer_3: values[2]
    };

    console.log("data from chatbot", values2);

    axios
      .post("/createsentiment", values2)
      .then(
        function(response) {
          console.log("On Response Before: " + this.state.sentimentScore);
          this.setState({
            sentimentScore: response.data.sentiment_score
          });
          console.log("On Response After: " + this.state.sentimentScore);
        }.bind(this)
      )
      .catch(err => {
        console.log("chatbot.js handleClick axios.post /form catch err: ", err);
      });
  }

  getSentimentScore() {
    if (this.state.sentimentScore > 6.0) {
      return (
        <div className="chatbot-component">
          <p>{this.state.sentimentScore}</p>
          <p>You are awesome &#128526; &#128525;! </p>
          <Link to="/sentimentchart">
            <button>Check last days mood</button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="chatbot-component">
          <p>{this.state.sentimentScore}</p>
          <p>It's time to lift yourself up &#128521;!</p>
          <Link to="/form">
            <button>Gratitude Journal</button>
          </Link>
        </div>
      );
    }

    return this.state.sentimentScore;
  }

  render() {
    const theme = {
      background: "#ffffff",
      fontFamily: "Poppins",
      headerBgColor: "#f0c06e",
      headerFontColor: "#fff",
      headerFontSize: "15px",
      botBubbleColor: "#f0c06e",
      botFontColor: "#fff",
      userBubbleColor: "#fff",
      userFontColor: "#4a4a4a"
    };

    // console.log("this.state from chatbot", this.state);
    // const { sentimentScore } = this.state;
    console.log("this.state from chatbot", this.state);
    console.log("this.props from chatbot", this.props);
    return (
      <div className="background">
        <div className="chatbot">
          <ThemeProvider theme={theme}>
            <ChatBot
              handleEnd={this.handleEnd}
              steps={[
                {
                  id: "0",
                  message:
                    "Hello, I am feelyBot. I am here to check and track your daily mood.",
                  trigger: "name"
                },

                {
                  id: "name",
                  message: "What's your name?",
                  trigger: "myname"
                },
                {
                  id: "myname",
                  user: true,
                  trigger: "wonderful"
                },
                {
                  id: "wonderful",
                  message:
                    "Wonderful {previousValue}! I will now ask you three simple questions.",
                  trigger: "1"
                },
                {
                  id: "1",
                  message: "How do you feel today?",
                  trigger: "answer_1"
                },
                {
                  id: "answer_1",
                  user: true,
                  trigger: "2"
                },
                {
                  id: "2",
                  message:
                    "Can you describe your energy-level? Do you feel productive or rather lazy?",
                  trigger: "answer_2"
                },
                {
                  id: "answer_2",
                  user: true,
                  trigger: "3"
                },
                {
                  id: "3",
                  message: "Do you feel loved and appreciated?",
                  trigger: "answer_3"
                },
                {
                  id: "answer_3",
                  user: true,
                  trigger: "end-message"
                },
                {
                  id: "end-message",
                  message: "Feely is calculating your happiness score...",
                  trigger: "another-message"
                },
                {
                  id: "another-message",
                  end: true,
                  component: (
                    <Sentimentscore
                      getSentimentScore={this.getSentimentScore}
                    />
                  )
                }
              ]}
            />
          </ThemeProvider>
        </div>
      </div>
    );
  }
}
