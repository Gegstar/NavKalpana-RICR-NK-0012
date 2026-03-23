"use client";

import { useMemo, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppSelector } from "@/redux/store";
import { Box } from "@mui/material";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = useAppSelector((state) => state.global.settings);
  const [loaded, setLoaded] = useState(false);

  const theme = useMemo(() => {
    const themeSettings = settings?.theme_settings;
    const colors = themeSettings?.colors || {};
    const isDark = themeSettings?.dark_mode_enabled;

    const mode: "light" | "dark" = isDark ? "dark" : "light";

    return createTheme({
      palette: {
        mode,
        primary: { main: colors.primary || "#6366F1" },
        secondary: { main: colors.secondary || "#06B6D4" },

        background: {
          default:
            colors.background ||
            (isDark ? "#020617" : "#F8FAFC"),
          paper:
            colors.surface ||
            (isDark ? "#0F172A" : "#FFFFFF"),
        },

        text: {
          primary:
            colors.text_primary ||
            (isDark ? "#F1F5F9" : "#0F172A"),
          secondary:
            colors.text_secondary ||
            (isDark ? "#94A3B8" : "#64748B"),
        },

        divider: isDark ? "#1E293B" : "#E2E8F0",
      },
    });
  }, [settings]);

  //  update CSS variables + trigger smooth load
  useEffect(() => {
    if (!settings?.theme_settings) return;

    const root = document.documentElement;
    const colors = settings.theme_settings.colors || {};
    const isDark = settings.theme_settings.dark_mode_enabled;

    root.style.setProperty("--color-primary", colors.primary || "#6366F1");
    root.style.setProperty("--color-background", colors.background || (isDark ? "#020617" : "#F8FAFC"));
    root.style.setProperty("--color-surface", colors.surface || (isDark ? "#0F172A" : "#FFFFFF"));
    root.style.setProperty("--color-text-primary", colors.text_primary || (isDark ? "#F1F5F9" : "#0F172A"));

    // trigger fade out
    setLoaded(true);
  }, [settings]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background: "var(--color-background)",
          zIndex: 9999,
          opacity: loaded ? 0 : 1,
          pointerEvents: "none",
          transition: "opacity 0.4s ease",
        }}
      />

      {children}
    </ThemeProvider>
  );
}