import "./public-path";
import React from "react";
import {Layout} from "./component/Layout";
import {Provider} from "@react-spectrum/provider";
import {theme} from "@react-spectrum/theme-default";

export const App = () => {
    return (
        <Provider theme={theme} scale="medium" locale="zh-CN">
            <Layout>
                <React.Fragment>test</React.Fragment>
            </Layout>
        </Provider>
    );
};
