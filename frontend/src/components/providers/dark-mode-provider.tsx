'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const darkMode = useUIStore((state) => state.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
};
