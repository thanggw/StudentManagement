import { NextResponse } from "next/server";

export function middleware(request) {
  // Lấy token từ cookie hoặc header
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Các route không cần authentication
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicRoute && !token) {
    if (
      request.nextUrl.pathname.startsWith("/api") ||
      request.nextUrl.pathname.startsWith("/_next")
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
