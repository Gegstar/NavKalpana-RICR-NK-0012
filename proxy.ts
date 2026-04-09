import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ==========================
// 🎯 ROLE PATH CONFIG
// ==========================
const accessControl: Record<string, string[]> = {
  SUPER_ADMIN: ["/dashboard", "/users", "/settings","/my-courses","/business-units"],
  ADMIN: ["/dashboard", "/courses", "/students","/business-units"],
  TEACHER: ["/courses", "/lessons", "/profile"],
  STUDENT: ["/courses", "/profile","/dashboard","/student/dashboard","/super_admin","/my-courses"],
};

// ==========================
// 🌐 PUBLIC ROUTES
// ==========================
const publicRoutes = [
  "/",
  "/auth/student_login",
  "/auth/student_signup",
  "/auth/superadmin_login",
  "/auth/staff_login",
  "/auth/forgot_password"
];

// ==========================
// 🚀 PROXY (replaces middleware)
// ==========================
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ✅ Allow static/public files
  if (
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|map|txt|xml|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // ✅ Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔐 Get role from cookies
  const role = req.cookies.get("user_role")?.value;

  console.log("🔐 Role:", role);

  // ❌ Not logged in
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const allowedPaths = accessControl[role];
  console.log(" Allowed paths for role:", allowedPaths);

  // ❌ Invalid role
  if (!allowedPaths) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // ✅ Check access
  const isAllowed = allowedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isAllowed) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  return NextResponse.next();
}

// ==========================
// 🎯 MATCHER (same as before)
// ==========================
export const config = {
  matcher: ["/:path*"],
};