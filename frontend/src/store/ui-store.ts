import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  fullscreenMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  toggleFullscreen: () => void;
  setFullscreenMode: (fullscreen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  darkMode: false,
  fullscreenMode: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setDarkMode: (dark) => set({ darkMode: dark }),
  toggleFullscreen: () => set((state) => ({ fullscreenMode: !state.fullscreenMode })),
  setFullscreenMode: (fullscreen) => set({ fullscreenMode: fullscreen }),
}));
