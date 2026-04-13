"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { publicRoutes } from "@/lib/routes";

export default function FooterWrapper() {
  const pathname = usePathname();

  const isPublic = publicRoutes.some((route) => {
    // ✅ exact match for root
    if (route === "/") {
      return pathname === "/";
    }

    // ✅ match route or nested routes
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (!isPublic) return null;

  return <Footer />;
}
