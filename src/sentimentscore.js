import axios from "./axios";
import React from "react";
import Form from "./form";

export default class Sentimentscore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   mood: "Calculating",
      loading: false
    };
  }

  componentDidMount() {
    console.log("componentDidMount");
    axios
      .get("/getsentimentscore")
      .then(response => {
        console.log("sentimentscore.js then response: ", response);
        console.log("sentimentscore.js", response.data.sentiment_score);
        if (response.data.length !== 0) {
          console.log("there is data for mood");
          this.setState({
            mood: response.data.sentiment_score,
            loading: true
          });
        }
      })
      .catch(err => {
        console.log(
          "sentimentscore.js handleClick axios.post /form catch err: ",
          err
        );
      });
  }

  render() {
    const sentimentRank = this.state.mood;

    return (
      <div className="background-users">
        <p>This is your sentiment score {sentimentRank} </p>
      </div>
    );
  }
}
