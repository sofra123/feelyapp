import React from "react";
import axios from "./axios";
import Gratitudenote from "./gratitudinenote";
export default class AddGratitude extends React.Component {
  constructor(props) {
    super(props);

    this.state = { gratitude: "" };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log(e.target.value, "e.target.value");
    this.setState({ gratitude: e.target.value });
  }

  handleSubmit() {
    event.preventDefault();

    const gratitude = this.state.gratitude;
    console.log("inside handle function");

    axios
      .post("/gratitude", { gratitude: this.state.gratitude })
      .then(response => {
        console.log(
          "gratitude.js handleClick axios.post /bio then response: ",
          response
        );

        this.setState({
          sentimentScore: response.data.sentiment_score
        });
        console.log("gratitude inside handlesubmit: ", gratitude);
      })
      .catch(err => {
        console.log(
          "gratitude.js handleClick axios.post /bio catch err: ",
          err
        );
      });
  }

  getSentimentScore() {
    return this.state.gratitude;
  }

  render() {
    return (
      <div className="background">
        <div className="Container-gratitude">
          <div className="smileh1">
            <h1 className="smile">What are you grateful for?</h1>
          </div>
          <div className="gratitude-input">
            <form>
              <input
                type="text"
                name="title"
                placeholder="Type here your thoughts..."
                value={this.gratitude}
                onChange={this.handleChange}
                required
              />
              <button className="btn-gratitude" onClick={this.handleSubmit}>
                {" "}
                Add{" "}
              </button>
            </form>
          </div>
        </div>
        <Gratitudenote />
      </div>
    );
  }
}
