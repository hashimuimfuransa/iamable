import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityPreferences {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;
}

interface AccessibilityState {
  preferences: AccessibilityPreferences;
  setPreferences: (preferences: Partial<AccessibilityPreferences>) => void;
  togglePreference: (key: keyof AccessibilityPreferences) => void;
  resetPreferences: () => void;
}

const defaultPreferences: AccessibilityPreferences = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  keyboardNavigation: true,
  screenReader: false,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      togglePreference: (key) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: !state.preferences[key],
          },
        })),
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'accessibility-storage',
    }
  )
);
