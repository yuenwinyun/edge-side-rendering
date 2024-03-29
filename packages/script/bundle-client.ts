import webpack from "webpack";
import {merge} from "webpack-merge";
import {createBundler, createPathResolver} from "./helper";
import HTMLWebpackPlugin from "html-webpack-plugin";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import {createBaseCompilerConfig} from "./create-base-compiler";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";

const resolve = createPathResolver(__dirname);
const workDir = resolve("../client");
const baseCompilerConfig = createBaseCompilerConfig(workDir);

export const clientWebpackConfig = merge(baseCompilerConfig, {
    target: "web",
    entry: `${workDir}/src/index.tsx`,
    output: {
        path: `${workDir}/build`,
        filename: "static/js/[name].[chunkhash].js",
        publicPath: process.env.ASSET_PATH || "/",
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.BUILD_ENV": JSON.stringify("client"),
        }),
        new HTMLWebpackPlugin({
            template: resolve("./template.html"),
            inlineSource: ".css$",
            minify: {
                removeComments: false,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
                minifyCSS: true,
            },
        }),
        new MiniCSSExtractPlugin({
            filename: "static/css/[name].[chunkhash].css",
            ignoreOrder: true,
        }),
        // new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.styl$/,
                use: [MiniCSSExtractPlugin.loader, "css-loader", "stylus-loader"],
            },
            {
                test: /\.css$/,
                use: [MiniCSSExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "static/img/[name].[ext]",
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
});

createBundler(webpack(clientWebpackConfig))();
