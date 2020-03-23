import React from "react";
import axios from "axios";

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answer_1: "",
      answer_2: "",
      answer_3: ""
    };

    this.handleAnswer1 = this.handleAnswer1.bind(this);
    this.handleAnswer2 = this.handleAnswer2.bind(this);
    this.handleAnswer3 = this.handleAnswer3.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() {
  //   console.log("componentDidMount");
  //   axios
  //     .get("/getsentiment")
  //     .then(response => {
  //       console.log("form.js get sentiment then response: ", response);
  //     })
  //     .catch(err => {
  //       console.log("form.js handleClick axios.post /form catch err: ", err);
  //     });
  // }

  handleAnswer1(e) {
    console.log(e.target.value, "e.target.value");
    this.setState({ answer_1: e.target.value });
  }

  handleAnswer2(e) {
    console.log(e.target.value, "e.target.value");
    this.setState({ answer_2: e.target.value });
  }
  handleAnswer3(e) {
    console.log(e.target.value, "e.target.value");
    this.setState({ answer_3: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    let data = {
      answer_1: this.state.answer_1,
      answer_2: this.state.answer_2,
      answer_3: this.state.answer_3
    };

    console.log("data", data);

    axios
      .post("/createsentiment", data)
      .then(response => {
        console.log("form.js handleSubmit then response: ", response);
        console.log("data inside handlesubmit: ", data);
      })
      .catch(err => {
        console.log("form.js handleClick axios.post /form catch err: ", err);
      });
  }

  render() {
    return (
      <div>
        <form className="formmood">
          <p>How are you today?</p>
          <textarea onChange={this.handleAnswer1} />
          <p>Have you been productive?</p>
          <textarea onChange={this.handleAnswer2} />
          <p>What is the most impactful thing you did or learn today?</p>
          <textarea onChange={this.handleAnswer3} />
          <button onClick={this.handleSubmit}>Analyze mood</button>
        </form>
      </div>
    );
  }
}
