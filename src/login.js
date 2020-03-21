import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
// import { useStatefulFields } from "./useStatefulFields";
// import { useAuthSubmit } from "./useAuthSubmit";

// export default function Login() {
//     const [values, handleChange] = useStatefulFields();
//     const [error, handleSubmit] = useAuthSubmit("/login", values);
//     return (
//         <form>
//             {error && <p>something didn´t work!</p>}
//             <input name="email" type="text" onChange={handleChange} />
//             <input name="password" type="text" onChange={handleChange} />
//             <button onClick={handleSubmit}>submit</button>
//         </form>
//     );
// }

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        if (this.state.email && this.state.password) {
            axios
                .post("./login", { userData })
                .then(res => {
                    console.log("res", res);
                    console.log("res.data", res.data);
                    if (res.data.success) {
                        location.replace("/");
                        // req.session.userId = results.rows[0].id;
                    }
                })
                .catch(function(err) {
                    console.log("err in POST /UserData: ", err);
                    this.setState({ error: true });
                });
        }
    }
    render() {
        return (
            <div>
                <div className="container-register">
                    <div className="form-register">
                        <div className="form-login">
                            <h1> Login </h1>
                            {this.state.error && (
                                <div className="error">
                                    Error, please try again!
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
