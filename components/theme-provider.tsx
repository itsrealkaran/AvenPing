"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ReactNode, useEffect } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Force remove any dark class from html element
    const html = document.documentElement;
    html.classList.remove("dark");

    // Set data attribute to ensure light mode
    html.setAttribute("data-theme", "light");
  }, []);

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={true}
      themes={["light"]}
    >
      {children}
    </NextThemeProvider>
  );
}
