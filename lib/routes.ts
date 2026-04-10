// 🌐 PUBLIC ROUTES
export const publicRoutes = [
  "/",
  "/auth/student_login",
  "/auth/student_signup",
  "/auth/superadmin_login",
  "/auth/staff_login",
];

// 🎯 ROLE PATH CONFIG
export const accessControl: Record<string, string[]> = {
  SUPER_ADMIN: ["/dashboard", "/users", "/settings","/my-courses","/business-units"],
  ADMIN: ["/dashboard", "/courses", "/students","/business-units"],
  TEACHER: ["/courses", "/lessons", "/profile"],
  STUDENT: ["/courses", "/profile","/dashboard","/student/dashboard","/super_admin","/my-courses"],
};
