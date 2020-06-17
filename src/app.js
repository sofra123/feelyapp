import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";

import Profilepic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import Otherprofile from "./otherprofile";
import Findpeople from "./findpeople";
import Friends from "./friends";

import Form from "./form";
import Chatbot from "./chatbot";
import Sentimentchart from "./sentimentchart";
import Dropdown from "./dropdown";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pic: "dummyApp",
    };

    console.log("props from app", props);
    console.log("this.state", this.state);

    this.logout = this.logout.bind(this);
  }

  logout() {
    axios.get("/logout").then(() => {
      console.log("user logged out");
    });
    location.replace("/welcome");
  }

  componentDidMount() {
    console.log("componentDidMount");

    axios.get("/user").then(({ data }) => {
      this.setState({
        id: data.id,
        first: data.first,
        last: data.last,
        url: data.url,
      });
    });
  }

  render() {
    const { id, first, last, url } = this.state;
    if (!id) {
      return null;
    }

    return (
      <div>
        <div className="header-welcome">
          <div className="logo">
            <a href="/">
              <h1>Feely</h1>
            </a>
          </div>

          <div className="button-img">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Dropdown />
            </div>
          </div>
        </div>
        <BrowserRouter>
          <div>
            <Route
              exact
              path="/"
              render={() => (
                <Profile
                  id={this.state.id}
                  first={this.state.first}
                  last={this.state.last}
                  url={this.state.url}
                />
              )}
            />

            <Route path="/form" component={Form} />
            <Route path="/chatbot" component={Chatbot} />
            <Route path="/sentimentchart" component={Sentimentchart} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
