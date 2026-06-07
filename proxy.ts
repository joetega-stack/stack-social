import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!token) {
    if (isAuthPage) return NextResponse.next();

    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = decodeJWT(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    return response;
  }

  const isAdmin = payload.admin === true;

  //admin protection
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/main-page", request.url));
  }

  //user protection
  if (pathname.startsWith("/feed") && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/main-page/:path*",
    "/friendsProfileView/:path*",
    "/message/:path*",
    "/profile/:path*",
    "/post/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
