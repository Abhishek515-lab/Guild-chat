import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ThemeContext = createContext({
  theme: "sakura",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const themeClassMap = {
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

  const applyThemeClass = (t) => {
    const root = document.documentElement;

    // Remove old theme classes
    Object.values(themeClassMap).forEach((cls) => {
      if (cls) root.classList.remove(cls);
    });

    // Add new theme class
    const cls = themeClassMap[t];
    if (cls) root.classList.add(cls);
  };

  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem("app-theme", t);
    applyThemeClass(t);
  }, []);

  // Apply theme on first load
  useEffect(() => {
    applyThemeClass(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};