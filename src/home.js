import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Resetpassword from "./resetpassword";
import App from "./app";
import Profilepic from "./profilepic";
import Profile from "./profile";

export default function Home() {
  return (
    <div>
      <div className="header-welcome">
        <div className="logo">
          <h1>Feely</h1>
        </div>
        <div className="buttonheader">
          <Link to="/registration">
            <button>get started</button>
          </Link>
        </div>
      </div>
      <div className="welcome-container">
        <div className="message-container">
          <h1>Feely is your daily mood support</h1>
          <p>Track and improve your mood with help of the feelyBot </p>
          <Link to="/registration">
            <button>Join now</button>
          </Link>
        </div>
        <div className="image-container">
          <img src="/images/app.png" alt="image" />
        </div>
      </div>
    </div>
  );
}
