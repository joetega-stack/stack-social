import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const pathname = request.nextUrl.pathname
    let admin = false

    if (!token) {
        if (pathname === "/login" || pathname === "/signup") {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/signup", request.url))
    }

    try {
        const payload = token.split(".")[1]
        admin = JSON.parse(atob(payload)).admin
    } catch {
        if (pathname === "/login" || pathname === "/signup") {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Admin route protection
    if (pathname.startsWith("/admin") && !admin) {
        return NextResponse.redirect(new URL("/feed", request.url))
    }

    // Redirect admin to admin dashboard
    if (pathname === "/signup" && admin) {
        return NextResponse.redirect(new URL("/admin", request.url))
    }
  
  return NextResponse.next();
}

export const config = {
    matcher: [
        "/feed/:path*",
        "/profile/:path*",
        "/post/:path*",
        "/settings/:path*",
        "/login",
        "/signup"
    ]
}
