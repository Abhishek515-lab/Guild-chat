import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";

const ThemeContext = createContext(null);

const THEME_CLASS_MAP = {
  sakura: "",
  neon: "theme-neon",
  rainy: "theme-rainy",
  light: "theme-light",
  hacker: "theme-hacker",
  game: "theme-game",
  futuristic: "theme-futuristic",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("app-theme") || "sakura";
  });

  const applyThemeClass = useCallback((targetTheme) => {
    const root = document.documentElement;

    Object.values(THEME_CLASS_MAP).forEach((cls) => {
      if (cls) root.classList.remove(cls);
    });

    const cls = THEME_CLASS_MAP[targetTheme];
    if (cls) root.classList.add(cls);
  }, []);

  const setTheme = useCallback((t) => {
    if (!THEME_CLASS_MAP[t] && t !== "sakura") return;
    setThemeState(t);
    localStorage.setItem("app-theme", t);
    applyThemeClass(t);
  }, [applyThemeClass]);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme, applyThemeClass]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme
  }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};