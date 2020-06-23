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
