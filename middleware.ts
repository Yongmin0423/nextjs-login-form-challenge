import getSession from "./lib/session";
import { NextRequest, NextResponse } from "next/server";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/log-in": true,
  "/create-account": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  
  // 이미 로그인 페이지나 회원가입 페이지에 있다면 세션 체크를 하지 않음
  if (exists) {
    if (session.id) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

  // 보호된 페이지에 접근할 때 세션이 없으면 로그인 페이지로 리다이렉트
  if (!session.id) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
