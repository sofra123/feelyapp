import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";

// rendering profilePic and Uploader
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        
        };

        console.log("props from app", props);
        console.log("this.state", this.state);

        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.finishedUploading = this.finishedUploading.bind(this);
        // this.setBio = this.setBio.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Passes functions to ProfilePic and Uploader for making changes to its state

    // get request to informations we have

    showUploader() {
        this.setState({
            uploaderVisible: true
        });
    }

    // setBio(value) {
    //     console.log("bio in app - ", value);
    //     this.setState({
    //         bio: value
    //     });
    //     //update in to database
    // }

    logout() {
        axios.get("/logout").then(() => {
            console.log("user logged out");
        });
        location.replace("/welcome");
    }

    hideUploader() {
        this.setState({
            uploaderVisible: false
        });
        console.log("hideuploader");
    }

   

    finishedUploading(newUrl) {
        console.log("this.state after upload", this.state);
        this.setState({ url: newUrl });
    }



    componentDidMount() {
        console.log("componentDidMount");

        axios.get("/user").then(({ data }) => {
            this.setState({
                id: data.id,
                first: data.first,
                last: data.last,
                url: data.url,
                // bio: data.bio,
               
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
                            <h1>Artnet</h1>
                        </a>
                    </div>
                    <div className="menu">
                        <a href="/users">
                            <h1>Find people</h1>
                        </a>
                    </div>
                    <div className="menu">
                        <a href="/friends-wannabe">
                            <h1>My Friends</h1>
                        </a>
                    </div>
                    <div className="menu">
                        <a href="/chat">
                            <h1>Chat</h1>
                        </a>
                    </div>

                    {/* <div>
                        <button>Logout</button>
                    </div> */}
                    <div className="button-img">
                        <Profilepic url={this.state.url} />
                        {this.state.uploaderVisible && (
                            <Uploader
                                finishedUploading={this.finishedUploading}
                                hideUploader={this.hideUploader}
                            />
                        )}
                        <div className="btn-logout">
                            <button onClick={this.logout}>logout</button>
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
                                    showUploader={this.showUploader}
                                    hideUploader={this.showUploader}
                                    // bio={this.state.bio}
                                    // setBio={this.setBio}
                                
                                   
                                />
                            )}
                        />
                        {/* <Route path="/user/:id" component={Otherprofile} />
                        <Route path="/users" component={Findpeople} />
                        <Route path="/friends-wannabe" component={Friends} />
                        <Route path="/chat" component={Chat} /> */}
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
