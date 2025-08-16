import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/signin?message=admin-required", req.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith("/auth/") && token) {
      return NextResponse.redirect(new URL("/events", req.url));
    }

    // Allow access to other routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/landing") ||
          pathname.startsWith("/events") ||
          pathname.startsWith("/leaderboard") ||
          pathname.startsWith("/results") ||
          pathname.startsWith("/_next") ||
          pathname === "/"
        ) {
          return true;
        }

        // Require authentication for protected routes
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // Admin routes require admin role
        if (pathname.startsWith("/admin")) {
          return !!token && token.role === "admin";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
