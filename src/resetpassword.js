import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Resetpassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentDisplay: 1 };

        this.handleChange = this.handleChange.bind(this);
        this.handleReset1 = this.handleReset1.bind(this);
        this.handleReset2 = this.handleReset2.bind(this);
    }
    handleChange(e) {
        console.log("handleChange running");
        console.log(e.target.value, "e.target.value");
        this.setState(
            {
                [e.target.name]: e.target.value //variable as property. works for all the inputs!!
            },
            () => console.log(this.state)
        ); // because I don´t want that the console.log happens before setState is done
    }

    handleReset1(e) {
        console.log("handlesubmit running");
        event.preventDefault();

        const mailData = {
            name: this.state
        };
        console.log("mailData", mailData);

        axios
            .post("/resetpassword/start", { mailData })
            .then(res => {
                console.log("res.data", res.data);

                if (res.data.success) {
                    console.log("success in front reset");
                    this.setState({ currentDisplay: 2 });
                }
            })
            .catch(function(err) {
                console.log("err in POST /resetpassword: ", err);
                this.setState({ error: true });
            });
    }

    handleReset2(e) {
        event.preventDefault();
        const newPassword = {
            name: this.state
        };
        axios
            .post("/resetpassword/verify", { newPassword })
            .then(res => {
                console.log("res.data", res.data);
                if (res.data.success) {
                    console.log("success in front reset");
                    this.setState({ currentDisplay: 3 });
                }
            })
            .catch(function(err) {
                console.log("err in POST /resetpassword: ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div>
                {this.state.currentDisplay == 1 && (
                    <div>
                        <h1>Reset Password</h1>
                        {this.state.error && (
                            <div className="error">Error, no e-mail found!</div>
                        )}
                        <h2>Write your e-mail to verify your identity</h2>

                        <input
                            onChange={this.handleChange}
                            name="email"
                            type="text"
                            placeholder="E-Mail "
                        />
                        <button
                            onClick={() => this.handleReset1()}
                            type="submit"
                        >
                            submit
                        </button>
                    </div>
                )}
                {this.state.currentDisplay == 2 && (
                    <div>
                        <h1>Reset Password</h1>
                        {this.state.error && (
                            <div className="error">Error, no e-mail found!</div>
                        )}
                        <h2>Please enter the code you received</h2>
                        <input
                            onChange={this.handleChange}
                            name="code"
                            type="text"
                            placeholder="code "
                        />
                        <h2>Please set a new password</h2>
                        <input
                            onChange={this.handleChange}
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                        <button
                            onClick={() => this.handleReset2()}
                            type="submit"
                        >
                            submit
                        </button>
                    </div>
                )}
                {this.state.currentDisplay == 3 && (
                    <div>
                        <h1>Reset Password</h1>
                        <h2>success!</h2>
                        <p>
                            You can now <Link to="/login">login</Link> with your
                            new password
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
