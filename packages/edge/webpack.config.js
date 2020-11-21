const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const fs = require("fs");
const workerMap = {};

if (process.env.NODE_ENV === "development") {
    // workerMap["static"] = path.resolve(__dirname, "./src/static.ts")
    workerMap["ssr"] = path.resolve(__dirname, "./src/ssr.ts");
} else {
    fs.readdirSync(path.resolve(__dirname, "./src")).forEach((file) => {
        workerMap[file.replace(/(.*).ts/, "$1")] = path.resolve(__dirname, `./src/${file}`);
    });
}

module.exports = {
    mode: "production",
    target: "webworker",
    entry: workerMap,
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            path: path.resolve(__dirname, "./build"),
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({extractComments: true})],
    },
};
