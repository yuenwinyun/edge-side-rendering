addEventListener("fetch", (event) => {
    event.respondWith(handleStaticRequest(event.request));
});

async function handleStaticRequest(request: Request) {
    let bucketURL;
    try {
        bucketURL = BUCKET_URL;
    } catch {
        bucketURL = "https://storage.googleapis.com/commonismore-v2";
    }

    const requestURL = new URL(request.url);
    const response = await fetch(`${bucketURL}${requestURL.pathname}`);
    const {readable, writable} = new TransformStream();
    response.body?.pipeTo(writable);
    return new Response(readable, response);
}
