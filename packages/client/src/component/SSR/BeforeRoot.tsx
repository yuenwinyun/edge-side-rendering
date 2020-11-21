import React from "react";

export const BeforeRoot = () => {
    const style: React.CSSProperties = {
        width: "375px",
        height: "5vh",
    };
    return <img style={style} src={require("public/demo-2.jpg")} alt="demo-2" />;
};
