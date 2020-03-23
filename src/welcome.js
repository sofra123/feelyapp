import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Resetpassword from "./resetpassword";
import App from "./app";
import Profilepic from "./profilepic";
import Profile from "./profile";
import Home from "./home";
// import Bioeditor from "./bioeditor";

export default function Welcome() {
    return (
        <div>
            {/* <div className="header-welcome">
                <div className="logo">
                    <h1>&#40;a&#41;social</h1>
                </div>
                <div className="button">
                    <button>get started</button>
                </div>
            </div>
            <div className="welcome-container">
                <div className="message-container">
                    <h1>
                        &#40;a&#41;social is the network community for people
                        sick of socializing.
                    </h1>
                    <button>Join us now</button>
                </div>

                <div className="image-container">
                    <img src="/images/loliness.jpg" alt="image" />
                </div>
            </div> */}
            <HashRouter>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/registration" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetpassword" component={Resetpassword} />
                    <Route path="/app" component={App} />
                    <Route path="/profilepic" component={Profilepic} />
                    <Route path="/profile" component={Profile} />
                    {/* <Route path="/bioeditor" component={Bioeditor} /> */}
                </div>
            </HashRouter>
        </div>
    );
}
