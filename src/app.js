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
      //   uploaderVisible: false,
      pic: "dummyApp"
      //   uploaderPicVisible: false
    };

    console.log("props from app", props);
    console.log("this.state", this.state);

    // this.showUploader = this.showUploader.bind(this);
    // this.showUploaderPic = this.showUploader.bind(this);
    // this.hideUploader = this.hideUploader.bind(this);
    // this.finishedUploading = this.finishedUploading.bind(this);
    // this.finishedUploadingPic = this.finishedUploadingPic.bind(this);
    this.logout = this.logout.bind(this);
  }

  // Passes functions to ProfilePic and Uploader for making changes to its state

  // get request to informations we have

  //   showUploader() {
  //     this.setState({
  //       uploaderVisible: true
  //     });
  //   }

  logout() {
    axios.get("/logout").then(() => {
      console.log("user logged out");
    });
    location.replace("/welcome");
  }

  //   hideUploader() {
  //     this.setState({
  //       uploaderVisible: false
  //     });
  //     console.log("hideuploader");
  //   }

  //   showUploaderPic() {
  //     this.setState({
  //       uploaderPicVisible: true
  //     });
  //     console.log("hideuploader");
  //   }

  //   finishedUploading(newUrl) {
  //     console.log("this.state after upload", this.state);
  //     this.setState({ url: newUrl });
  //   }

  //   finishedUploadingPic(newPic) {
  //     console.log("this.state after upload picture", this.state);
  //     this.setState({ pic: newPic });
  //   }

  componentDidMount() {
    console.log("componentDidMount");

    axios.get("/user").then(({ data }) => {
      this.setState({
        id: data.id,
        first: data.first,
        last: data.last,
        url: data.url,
        // bio: data.bio,
        pic: data.pic
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
            <Route path="/user/:id" component={Otherprofile} />
            <Route path="/users" component={Findpeople} />
            <Route path="/friends-wannabe" component={Friends} />

            <Route path="/form" component={Form} />
            <Route path="/chatbot" component={Chatbot} />
            <Route path="/sentimentchart" component={Sentimentchart} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
