import webpack from "webpack";
import {merge} from "webpack-merge";
import {createBaseCompilerConfig} from "./create-base-compiler";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import webpackNodeExternals from "webpack-node-externals";
import {createPathResolver, createBundler, filterOutFalsy} from "./helper";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import HTMLWebpackInlineSourcePlugin from "html-webpack-inline-source-plugin";

const resolve = createPathResolver(__dirname);
const clientDir = resolve("../client");
const serverDir = resolve("../server");
const baseClientConfig = createBaseCompilerConfig(clientDir);
const baseServerConfig = createBaseCompilerConfig(serverDir);

export const serverWebpackConfig = [
    merge(baseClientConfig, {
        target: "web",
        entry: `${clientDir}/src/index.tsx`,
        output: {
            path: `${serverDir}/build`,
            filename: "static/js/[name].[chunkhash].js",
            publicPath: process.env.ASSET_PATH || "/",
        },
        plugins: filterOutFalsy([
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                "process.env.BUILD_ENV": JSON.stringify("server"),
            }),
            new MiniCSSExtractPlugin({
                filename: "static/css/[name].[chunkhash].css",
                ignoreOrder: true,
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
            // @ts-ignore
            // new HTMLWebpackInlineSourcePlugin(HTMLWebpackPlugin),
        ]),
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
    }),
    merge(baseServerConfig, {
        entry: `${serverDir}/src/index.ts`,
        output: {
            path: `${serverDir}/build`,
            filename: "index.js",
        },
        target: "node",
        externals: webpackNodeExternals(),
        module: {
            rules: [
                {
                    test: /\.styl$/,
                    use: ["css-loader", "stylus-loader"],
                },
                {
                    test: /\.css$/,
                    use: ["css-loader"],
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    loader: "file-loader",
                    options: {
                        name: "static/img/[name].[ext]",
                        emitFile: false,
                        esModule: false,
                    },
                },
            ],
        },
    }),
];

createBundler(webpack(serverWebpackConfig))(true);
