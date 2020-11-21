interface EnhancedComment extends Omit<Comment, "text"> {
    text: "before-root" | "after-root" | "head-script" | "head-style" | "head-meta";
}

addEventListener("fetch", (event) => {
    event.respondWith(handleSSRRequest(event.request));
});

async function handleSSRRequest(request: Request) {
    const requestURL = new URL(request.url);
    if (requestURL.pathname !== "/") {
        return await fetch(request);
    } else {
        const response = await fetch(requestURL.origin);
        const elementTransformer = new ElementTransformer();
        const htmlRewriter = new HTMLRewriter();
        return htmlRewriter.on("*", elementTransformer).transform(response);
    }
}

class ElementTransformer implements ElementHandlerOptionals {
    comments(comment: EnhancedComment) {
        switch (typedTrim(comment.text)) {
            case "before-root":
                comment.replace(
                    `
                    <div onclick="alert('from worker')">from worker</div>
                `,
                    {html: true}
                );
                break;
            case "after-root":
            case "head-script":
            case "head-style":
            case "head-meta":
            default:
                comment.remove();
        }
    }
}

function typedTrim<T extends string>(str: T) {
    return str.trim() as T;
}
