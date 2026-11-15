import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // Default to bright colorful aesthetic as requested

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'light'; // Keep bright and radiant
        document.documentElement.classList.remove('dark');
        set({ theme: next });
      },

      setTheme: (theme) => {
        document.documentElement.classList.remove('dark');
        set({ theme });
      },
    }),
    {
      name: 'chromalux-theme-preference',
      onRehydrateStorage: () => () => {
        document.documentElement.classList.remove('dark');
      },
    }
  )
);
