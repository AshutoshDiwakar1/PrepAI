import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import arcjet, { detectBot, shield, slidingWindow, tokenBucket } from "@arcjet/next";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/'])

const aj =  arcjet({
    key: process.env.ARCJET_KEY!, 
    rules: [
      // Shield protects your app from common attacks e.g. SQL injection
      shield({ mode: "LIVE" }),
      // Create a bot detection rule
      detectBot({
        mode: "LIVE", 
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          "CATEGORY:MONITOR", 
          //"CATEGORY:PREVIEW", 
        ],
      }),
      slidingWindow({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        max: 100, // Max 100 requests
        interval: "1m", // Per 1 minute

      })
    ]
})

export default clerkMiddleware(async (auth, req) => {
    const decision = await aj.protect(req);

    if(decision.isDenied()) {
       return new Response("Too many requests", { status: 429 });
    }
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}