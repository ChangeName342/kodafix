import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgFeat: string;
  textHi: string;
  textMid: string;
  textLow: string;
  border: string;
  borderSubtle: string;
  navBg: string;
}

const DARK: ThemeColors = {
  bg:          "#070710",
  bgCard:      "#0d0d1a",
  bgFeat:      "#100d1f",
  textHi:      "#f1f0ff",
  textMid:     "rgba(241,240,255,0.52)",
  textLow:     "rgba(241,240,255,0.27)",
  border:      "rgba(255,255,255,0.07)",
  borderSubtle:"rgba(255,255,255,0.04)",
  navBg:       "rgba(7,7,16,0.85)",
};

const LIGHT: ThemeColors = {
  bg:          "#f5f4ff",
  bgCard:      "#ffffff",
  bgFeat:      "#eeecff",
  textHi:      "#0f0e1f",
  textMid:     "rgba(15,14,31,0.60)",
  textLow:     "rgba(15,14,31,0.35)",
  border:      "rgba(15,14,31,0.09)",
  borderSubtle:"rgba(15,14,31,0.05)",
  navBg:       "rgba(245,244,255,0.92)",
};

interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
  c: ThemeColors;
}

const ThemeContext = createContext<ThemeCtx>({
  isDark: true,
  toggle: () => {},
  c: DARK,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("kf-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("kf-theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);
  const c = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, c }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
