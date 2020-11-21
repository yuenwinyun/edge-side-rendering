import React from "react";
import ReactDOMServer from "react-dom/server";
import {App} from "./App";
import {BeforeRoot} from "./component/SSR/BeforeRoot";

export const readableAppStream = ReactDOMServer.renderToNodeStream(<App />);

export const beforeRootStream = ReactDOMServer.renderToNodeStream(<BeforeRoot />);
