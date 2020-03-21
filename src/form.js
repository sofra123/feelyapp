import React from "react";
import axios from "axios";

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer_1: "",
      answer_2: "",
      answer_3: ""
    };
  }

  //   componentDidMount() {
  //     console.log("componentDidMount");
  //
  //   }

  handleAnswer1 = event => {
    this.setState({ answer_1: event.target.value });
  };

  handleAnswer2 = event => {
    this.setState({ answer_2: event.target.value });
  };

  handleAnswer3 = event => {
    this.setState({ answer_3: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    let data = {
      answer_1: this.state.answer_1,
      answer_2: this.state.answer_2,
      answer_3: this.state.answer_3
    };

    axios
      .post("/answers", { data })
      .then(response => {
        console.log("formquestions.js handleSubmit then response: ", response);
        console.log("data inside handlesubmit: ", data);
        setBio(bio);
      })
      .catch(err => {
        console.log(
          "formquestions.js handleClick axios.post /bio catch err: ",
          err
        );
      });
  };

  render() {
    return (
      <div>
        <form>
          <p>How are you today?</p>
          <textarea onChange={this.handleAnswer1} />
          <p>What are you most grateful for?</p>
          <textarea onChange={this.handleAnswer2} />
          <p>What progress have you made?</p>
          <textarea onChange={this.handleAnswer3} />
          <button onClick={this.handleSubmit}>Analyze mood</button>
        </form>
      </div>
    );
  }
}
