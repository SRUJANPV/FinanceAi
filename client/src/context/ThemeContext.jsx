import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(null);
const initialTheme = () => localStorage.getItem('smartspend-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
export function ThemeProvider({ children }) { const [theme, setTheme] = useState(initialTheme); useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('smartspend-theme', theme); }, [theme]); return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((value) => value === 'dark' ? 'light' : 'dark') }}>{children}</ThemeContext.Provider>; }
export const useTheme = () => useContext(ThemeContext);
