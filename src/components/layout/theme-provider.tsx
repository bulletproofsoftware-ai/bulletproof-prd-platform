"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Read the stored theme in a lazy initialiser rather than an effect. Setting
  // state from an effect body cascades an extra render (react-hooks/
  // set-state-in-effect) and left the first paint on the default theme.
  // `theme` never reaches server-rendered markup — ThemeToggle switches its
  // icons through Tailwind's `dark:` variants, which key off the class on
  // <html> — so initialising from localStorage cannot cause a hydration
  // mismatch, and the `mounted` latch that existed to defer this is no longer
  // needed.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
