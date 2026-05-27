import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // NextAuth places the edge-extracted token directly on the request object
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    if (token) {
      const role = token.role;

      // Super Admin protection
      if (pathname.startsWith("/dashboard/super-admin")) {
        if (role !== "SUPER_ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      // Admin protection (Admins and Super Admins allowed)
      if (pathname.startsWith("/dashboard/admin")) {
        if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      // Redirect authenticated users away from login/register pages
      if (pathname === "/login" || pathname === "/register") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow unauthenticated access to auth entry pages
        if (pathname === "/login" || pathname === "/register") {
          return true;
        }
        
        // Require a valid session token for any dashboard path
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }
        
        return true;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
