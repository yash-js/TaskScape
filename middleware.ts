import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes are public
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  const { pathname } = req.nextUrl;
  
  // Skip redirects for static files and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // If user is authenticated and on a public route, redirect to dashboard
  if (userId && isPublicRoute(req)) {
    // Don't redirect if already on sign-in/sign-up pages
    if (pathname === '/sign-in' || pathname === '/sign-up') {
      return NextResponse.next();
    }
    
    let path = "/select-org";
    if (orgId) {
      path = `/organization/${orgId}`;
    }
    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }
  
  // If user is not authenticated and trying to access protected route
  if (!userId && !isPublicRoute(req)) {
    // Don't redirect if already on sign-in page
    if (pathname === '/sign-in') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  
  // If user is authenticated but no org and not on select-org page
  if (userId && !orgId && pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelection);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
