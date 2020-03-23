import axios from "axios";
import Welcome from "./Welcome"; //with default no need curly brackets
import Registration from "./Registration";

// called only once

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;
if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    console.log("calling init of socket. ");
    init(store);

    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(component, document.querySelector("main"));

// componentDidMount() {
//             //lifecycle method. Class component have states and lifecycle methods
//             // this is a good place to do axios requests
//             axios.post("./user").then(({data}) => {

//             });

//         } //componentDidMountcloses

// ReactDOM.render(component, document.querySelector("main"));

// // can have states and function components cannot have states
// class HelloWorld extends React.Component {
//     constructor() {
//         super(); //creates "this". Not require to set default values
//         this.state = {};
//         this.handleClick = this.handleClick.bind(this);
//     }

//     componentDidMount() {
//         //lifecycle method. Class component have states and lifecycle methods
//         // this is a good place to do axios requests
//         // axios.get("./user").then(({data}) => {

//         // });
//         setTimeout(() => {
//             // this.state.naem = RespFromServer //don´t do this
//             this.setState({
//                 name: "allspice"
//             });
//         }, 2000);
//     } //componentDidMountcloses

//     handleClick() {
//         console.log("handleClick running");
//         this.setState({
//             name: "Alistair",
//             location: "Berlin"
//         });
//     }

//     render() {
//         return (
//             <div>
//                 <p> {this.state.name} </p>
//                 <p onClick={this.handleClick}> I am a class component </p>{" "}
//                 <User name={this.state.name} />
//             </div>
//         );
//     }
// }

// function User(props) {
//     console.log("props: ", props);
//     return <h1>{props.name}</h1>;
// }
