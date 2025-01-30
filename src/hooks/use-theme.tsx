import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Dispatch custom event for Monaco Editor
    window.dispatchEvent(new CustomEvent("themeChange", { detail: theme }));
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () =>
      setTheme((prev) => (prev === "light" ? "dark" : "light")),
  };
}
