import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleError() {
        if (!this.state.first) {
            this.setState({ errorfirst: true });
        } else if (!this.state.last) {
            this.setState({ errorlast: true });
        } else if (!this.state.email) {
            this.setState({ erroremail: true });
        } else if (!this.state.password) {
            this.setState({ errorpassword: true });
        }
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

    handleSubmit(e) {
        event.preventDefault();

        const userData = {
            name: this.state
        };
        console.log("userData", userData);
        if (
            this.state.first &&
            this.state.last &&
            this.state.email &&
            this.state.password
        ) {
            axios
                .post("./registration", { userData })
                .then(res => {
                    console.log("res", res);
                    console.log("res.data", res.data);
                    if (res.data.success) {
                        location.replace("/");
                    }
                })

                .catch(function(err) {
                    console.log("err in POST /UserData: ", err);
                    this.setState({ error: true });
                });
        } else {
            this.setState({ error: true });
        }

        // if (!this.state.first) {
        //     this.setState({ errorfirst: true });
        // } else if (!this.state.last) {
        //     this.setState({ errorlast: true });
        // } else if (!this.state.email) {
        //     this.setState({ erroremail: true });
        // } else if (!this.state.password) {
        //     this.setState({ errorpassword: true });
        // }
    }

    render() {
        return (
            <div>
                <div className="container-register">
                    <div className="form-register">
                        <div className="form-login">
                            <h1> Register </h1>
                            {this.state.error && (
                                <div className="error">
                                    Error, please try again!
                                </div>
                            )}
                            {this.state.errorfirst && (
                                <div className="error">
                                    {" "}
                                    Please add a your first name!
                                </div>
                            )}
                            {this.state.errorlast && (
                                <div className="error">
                                    {" "}
                                    Please add your last name!
                                </div>
                            )}
                            {this.state.erroremail && (
                                <div className="error">
                                    {" "}
                                    Please add a valid e-mail!
                                </div>
                            )}
                            {this.state.errorpassword && (
                                <div className="error">
                                    {" "}
                                    Please add a password!
                                </div>
                            )}
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    onChange={this.handleChange}
                                    name="first"
                                    type="text"
                                    placeholder="first Name "
                                />
                                <input
                                    onChange={this.handleChange}
                                    name="last"
                                    type="text"
                                    placeholder="Last Name "
                                />
                                <input
                                    onChange={this.handleChange}
                                    name="email"
                                    type="text"
                                    placeholder="E-Mail "
                                />
                                <input
                                    onChange={this.handleChange}
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                />
                                <button type="submit">submit</button>
                            </form>
                            <Link to="/login">Click here to Log in!</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
