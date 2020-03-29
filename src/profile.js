import React from "react";
import Profilepic from "./profilepic";
import Favoriteartists from "./favoriteartists";
import Pictures from "./pictures";
import { Link } from "react-router-dom";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
  }

  render() {
    return (
      <div className="container-profile">
        <h2>Hello {this.props.first}, how is your mood today?</h2>
        <div className="container-box">
          <Link to="/sentimentchart">
            <div className="box">
              <span>Check last 7 days moods</span>
            </div>
          </Link>
          <Link to="/chatbot">
            <div className="box">
              <span>Ask FeelyBot</span>
            </div>
          </Link>
          <Link to="/form">
            <div className="box">
              <span>Gratitude Journal</span>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
