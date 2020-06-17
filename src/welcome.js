import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Resetpassword from "./resetpassword";
import App from "./app";
import Profile from "./profile";
import Home from "./home";

export default function Welcome() {
  return (
    <div>
      <HashRouter>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/registration" component={Registration} />
          <Route path="/login" component={Login} />
          <Route path="/resetpassword" component={Resetpassword} />
          <Route path="/app" component={App} />
          <Route path="/profilepic" component={Profilepic} />
          <Route path="/profile" component={Profile} />
        </div>
      </HashRouter>
    </div>
  );
}
