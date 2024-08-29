import { httpRouter, HttpRouter } from "convex/server";

import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/stripe",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        return new Response(null, {
            status: 200
        });
    })
});

export default http;