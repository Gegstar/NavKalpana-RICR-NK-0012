import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

import ReduxProvider from "@/redux/provider";
import InitRedux from "@/redux/store/InitRedux";
import ThemeRegistry from "@/app/ThemeRegistry";
import AppProviderWrapper from "@/components/AppProviderWrapper"; // ✅ import the wrapper

import { headers } from "next/headers";

import "./globals.css";

// ==========================
//  GET SUBDOMAIN
// ==========================
async function getSubdomain() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return null;

  console.log("🌐 Host header:", host);
  //  if (host.includes("localhost")) return "lms-frontend-1-6mx4";
  if (host.includes("localhost")) return "lms-frontend-p2yr";

  return host.split(".")[0];
}

// ==========================
//  FETCH SETTINGS (SSR)
// ==========================
async function getSettings(subdomain: string) {
  try {
    console.log("🔍 Fetching settings for subdomain:", subdomain);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/default/settings/${subdomain}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("❌ SSR fetch error:", err);
    return null;
  }
}

// ==========================
// 🚀 ROOT LAYOUT (SERVER)
// ==========================
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const subdomain = await getSubdomain();
  const settings = subdomain ? await getSettings(subdomain) : null;

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <AppRouterCacheProvider>
          <ReduxProvider>
            {/*  HYDRATE REDUX WITH SSR SETTINGS */}
            <InitRedux settings={settings} />

            {/*  CLIENT‑SIDE CONTEXT PROVIDER */}
            <AppProviderWrapper>
              <ThemeRegistry>
                <Navbar />
                <main>{children}</main>
                <Footer />
                <Toaster position="top-center" />
              </ThemeRegistry>
            </AppProviderWrapper>
          </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}