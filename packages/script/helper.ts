import path from "path";
import {MultiCompiler, Compiler} from "webpack";
import WebpackDevServer from "webpack-dev-server";

type WithoutFalsy<T> = T extends undefined | null ? never : T extends false ? never : T extends void ? never : T;

export function filterOutFalsy<T>(array: T[]) {
    return array.filter(Boolean) as WithoutFalsy<T>[];
}

export function createPathResolver(dirname: string) {
    return function (target: string) {
        return path.resolve(dirname, target);
    };
}

export function createBundler(compiler: Compiler | MultiCompiler) {
    return function (disableDevServer = false, port = 9090) {
        if (process.env.NODE_ENV === "development") {
            if (!disableDevServer) {
                new WebpackDevServer(compiler).listen(port, error => {
                    throw error;
                });
            } else {
                compiler.watch({poll: true}, console.info);
            }
        } else {
            compiler.run(console.info);
        }
    };
}
