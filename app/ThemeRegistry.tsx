"use client";

import { useMemo, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppSelector } from "@/store/store";
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
          default: colors.background || (isDark ? "#020617" : "#F8FAFC"),
          paper: colors.surface || (isDark ? "#0F172A" : "#FFFFFF"),
        },
        text: {
          primary: colors.text_primary || (isDark ? "#F1F5F9" : "#0F172A"),
          secondary: colors.text_secondary || (isDark ? "#94A3B8" : "#64748B"),
        },
        divider: colors.border || (isDark ? "#1E293B" : "#E2E8F0"),
      },
    });
  }, [settings]);

  // Update all CSS variables
  useEffect(() => {
    if (!settings?.theme_settings) return;

    const root = document.documentElement;
    const c = settings.theme_settings.colors || {};
    const isDark = settings.theme_settings.dark_mode_enabled;

    // 🎨 PRIMARY BRAND
    root.style.setProperty("--color-primary", c.primary || "#6366F1");
    root.style.setProperty("--color-primary-dark", c.primary_dark || "#4F46E5");
    root.style.setProperty("--color-primary-light", c.primary_light || "#818CF8");

    root.style.setProperty("--color-secondary", c.secondary || "#06B6D4");
    root.style.setProperty("--color-accent", c.accent || "#F59E0B");

    // 🧠 NEUTRAL COLORS
    root.style.setProperty("--color-background", c.background || (isDark ? "#020617" : "#F8FAFC"));
    root.style.setProperty("--color-surface", c.surface || (isDark ? "#0F172A" : "#FFFFFF"));

    root.style.setProperty("--color-text-primary", c.text_primary || (isDark ? "#F1F5F9" : "#0F172A"));
    root.style.setProperty("--color-text-secondary", c.text_secondary || (isDark ? "#94A3B8" : "#64748B"));
    root.style.setProperty("--color-text-muted", c.text_muted || "#94A3B8");

    root.style.setProperty("--color-border", c.border || (isDark ? "#1E293B" : "#E2E8F0"));

    // 🌙 DARK MODE (optional overrides)
    root.style.setProperty("--color-background-dark", c.background_dark || "#020617");
    root.style.setProperty("--color-surface-dark", c.surface_dark || "#0F172A");
    root.style.setProperty("--color-text-primary-dark", c.text_primary_dark || "#F1F5F9");
    root.style.setProperty("--color-text-secondary-dark", c.text_secondary_dark || "#94A3B8");
    root.style.setProperty("--color-border-dark", c.border_dark || "#1E293B");

    // 🌈 GRADIENTS
    root.style.setProperty("--gradient-primary", c.gradient_primary || "linear-gradient(135deg, #6366F1, #8B5CF6)");
    root.style.setProperty("--gradient-dark", c.gradient_dark || "linear-gradient(135deg, #020617, #0F172A)");

    setLoaded(true);
  }, [settings]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Smooth fade overlay */}
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