"use client";

import { useState, useEffect } from "react";

/**
 * Hook to get the computed value of a CSS variable.
 * @param variableName The name of the CSS variable (e.g., "--brand-primary")
 * @returns The current value of the variable
 */
export function useThemeColor(variableName: string): string {
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const fetchColor = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
      if (value) setColor(value);
    };

    fetchColor();

    // Optional: Re-fetch if theme changes or on window focus
    window.addEventListener("focus", fetchColor);
    
    return () => window.removeEventListener("focus", fetchColor);
  }, [variableName]);

  return color;
}
