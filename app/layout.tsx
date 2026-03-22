"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeContextProvider } from "@/context/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <ThemeContextProvider>
            <CssBaseline />

            {/*  Navbar */}
            <Navbar />

            {/*  Main Content */}
            <main>{children}</main>

            {/*  Footer */}
            <Footer />

            {/* GLOBAL TOAST CONFIG */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                // style: {
                //   background: "#333",
                //   color: "#fff",
                //   borderRadius: "8px",
                //   padding: "12px 16px",
                // },
                // success: {
                //   style: {
                //     background: "#22c55e",
                //   },
                // },
                // error: {
                //   style: {
                //     background: "#ef4444",
                //   },
                // },
              }}
            />
          </ThemeContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
