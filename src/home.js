import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Resetpassword from "./resetpassword";
import App from "./app";
import Profilepic from "./profilepic";
import Profile from "./profile";
// import Bioeditor from "./bioeditor";

export default function Home() {
    return (
        <div>
            <div className="header-welcome">
                <div className="logo">
                    <h1>Artnet</h1>
                </div>
                <div className="button">
                    <Link to="/registration">
                        <button>get started</button>
                    </Link>
                </div>
            </div>
            <div className="welcome-container">
                <div className="message-container">
                    <h1>
                        Artnet is the new network community for art lovers and
                        artists.
                    </h1>
                    <p>Share your passion with other people.</p>
                    <Link to="/registration">
                        <button>Join us now</button>
                    </Link>
                </div>
                <div className="image-container">
                    <img src="/images/monaandvincent.png" alt="image" />
                </div>
            </div>
        </div>
    );
}
