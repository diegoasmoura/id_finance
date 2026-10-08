import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

function withoutStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/entrar";
  if (isLogin || getSessionCookie(request)) return withoutStore(NextResponse.next());

  return withoutStore(NextResponse.redirect(new URL("/entrar", request.url)));
}

export const config = {
  matcher: ["/((?!api/auth|api/health|_next/static|_next/image|.*\\.(?:png|svg|ico|jpg|jpeg|webp)$).*)"],
};
