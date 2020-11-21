import express from "express";
import {readableAppStream} from "@esr/client/src/readable-app-stream";
import {beforeRoot} from "./before-root";
import fs from "fs";

const app = express();
const router = express.Router();
const port = Number(process.env.PORT) || 3000;
const appContent = readableAppStream.read();

router.use("/static", express.static("./static"));
router.get("/before-root", beforeRoot);

router.get("/", async (_, res) => {
    const readableHTML = fs.createReadStream("./index.html", {encoding: "utf8"});
    const replaceArgs = [/(<div.*id="app".*>).*(<\/div>)/g, `$1${appContent}$2`] as const;

    for await (const html of readableHTML) {
        if (html.match(replaceArgs[0])) {
            res.write(html.replace(...replaceArgs));
        } else {
            res.write(html);
        }
    }

    /**
     * for dynamic content:
     *
     * A. template
     * 1. render on server side
     *  server generate a html section and return to edge, the good is edge won't render html, developer don't need to
     *  maintain two template logic, the drawbacks is server should have SSR, and dynamic content size is large
     * 2. render on edge side
     *  server return data for edge rendering logic, the good here is server side don't need SSR(but client should have fallback),
     *  the drawbacks are edge cannot stream rendering content, edge should wait for the entire content loaded, then return to client
     *
     *  B. static content
     *  static content of template returned immediately, subsequent static content can return via:
     *  1. when it comes to dynamic content, await dynamic content loaded, then return to client(SEO friendly, blocking response)
     *  2. return all static content at first, then return dynamic content using something like bigpipe(SEO unfriendly, non-blocking)
     *
     *  C. dynamic content
     *  dynamic content need to fetch content from server, where edges would look to, dynamic content could support Dynamic Router for CDN.
     *  there two ways to let edge interact with origin.
     *  1. origin server turn entire html with specific comment, then edge use these comment to render dynamic content.
     *  2. origin server return data only, edge dynamically render html using template with these data.
     *
     *  D. client with CDN
     *
     *  1. water_fall
     *  2. async_insert
     */

    res.end();
});

app.use("/", router);
app.disable("x-powered-by");
app.listen(port, () => console.log(`Server started at port ${port}`));
process.on("uncaughtException", console.error);
