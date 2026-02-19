import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read NextAuth session token (works for both JWT and database sessions)
  const token = await getToken({ req });

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isUploadPage = pathname.startsWith("/upload");

  // 1) If user is logged in, block access to /login and /register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2) Protect /upload (must be logged in)
  if (!token && isUploadPage) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname); // come back to upload after login
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Choose which routes use middleware
export const config = {
  matcher: ["/upload/:path*", "/login", "/register"],
};

