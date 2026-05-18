import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext(null);

const THEME_KEY = 'app_theme';
const THEMES = ['light', 'dark'];

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored && THEMES.includes(stored)) {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function hasStoredThemePreference() {
  const stored = localStorage.getItem(THEME_KEY);
  return stored !== null && THEMES.includes(stored);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [hasExplicitTheme, setHasExplicitTheme] = useState(hasStoredThemePreference);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!hasExplicitTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [hasExplicitTheme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, nextTheme);
      return nextTheme;
    });
    setHasExplicitTheme(true);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
