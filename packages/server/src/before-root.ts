import express from "express";
import {beforeRootStream} from "@esr/client/src/readable-app-stream";

export const beforeRoot: express.Handler = function (_, res) {
    if (process.env.NODE_ENV === "development") {
        res.type("html");
    }
    beforeRootStream.pipe(res);
};
