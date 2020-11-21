import React from "react";
import ReactDOM from "react-dom";
import {App} from "./App";
import "./index.styl";

if (process.env.BUILD_ENV === "server") {
    ReactDOM.hydrate(<App />, document.querySelector("#app"));
} else {
    ReactDOM.render(<App />, document.querySelector("#app"));
}
