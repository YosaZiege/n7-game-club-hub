import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isUploadPage = pathname.startsWith("/upload");
  const isDeleguePage = pathname.startsWith("/delegue");

  // 1) If user is logged in, block /login and /register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2) Protect /upload (must be logged in)
  if (!token && isUploadPage) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 3) Protect /delegue (must be president)
  if (isDeleguePage) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (token.role !== "president") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload/:path*", "/login", "/register", "/delegue/:path*"],
};

