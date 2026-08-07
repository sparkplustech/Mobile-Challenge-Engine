import { useState } from 'react';

export type ThemeMode = 'light' | 'dark';

/** Stub — implement per challenge 06 README */
export function useThemeStorage() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  return { theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}
