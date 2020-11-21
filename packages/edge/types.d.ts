// @ts-ignore
import {KVNamespace} from "@cloudflare/workers-types";

declare global {
    const myKVNamespace: KVNamespace;
    const BUCKET_URL: string;
    const BUCKET_NAME: string;
    const ORIGIN: string;
}
