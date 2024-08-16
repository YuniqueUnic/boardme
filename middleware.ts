import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// currently, no page is protected, so it would not auto-redirecting to the auth page.
// So, according the docs of clerk middleware, we should make a list to store the route need to be protected.
// Record from the official docs about nextjs: By default, clerkMiddleware will not protect any routes. All routes are public and you must opt-in to protection for routes.
// Link: https://clerk.com/docs/references/nextjs/clerk-middleware
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]); // Make all routes protected

export default clerkMiddleware(
  (auth, req) => {
    if (!isPublicRoute(req)) {
      auth().protect();
    }
  },
  { debug: true }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
