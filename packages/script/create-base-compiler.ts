import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import {createPathResolver} from "./helper";

const resolve = createPathResolver(__dirname);

export function createBaseCompilerConfig(workDir: string): webpack.Configuration {
    return {
        mode: process.env.NODE_ENV as webpack.Configuration["mode"],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        configFile: resolve(`${workDir}/tsconfig.json`),
                        transpileOnly: true,
                    },
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                "process.env.ASSET_PATH": JSON.stringify(process.env.ASSET_PATH),
            }),
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".styl"],
            alias: {
                public: resolve("../../public"),
                component: resolve("../client/src/component"),
                seo: resolve(""),
            },
        },
        // optimization: {
        //     minimizer: [new TerserPlugin({extractComments: true})],
        //     minimize: true,
        // },
    };
}
