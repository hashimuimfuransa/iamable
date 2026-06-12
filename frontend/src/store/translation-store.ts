import { create } from 'zustand';

interface Translation {
  _id: string;
  inputType: string;
  inputContent: string;
  translatedText: string;
  confidenceScore: number;
  createdAt: string;
}

interface TranslationState {
  currentTranslation: string;
  isTranslating: boolean;
  confidenceScore: number;
  history: Translation[];
  savedItems: Translation[];
  setCurrentTranslation: (text: string) => void;
  setTranslating: (isTranslating: boolean) => void;
  setConfidenceScore: (score: number) => void;
  setHistory: (history: Translation[]) => void;
  setSavedItems: (items: Translation[]) => void;
  addToHistory: (translation: Translation) => void;
  clearCurrentTranslation: () => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  currentTranslation: '',
  isTranslating: false,
  confidenceScore: 0,
  history: [],
  savedItems: [],
  setCurrentTranslation: (text) => set({ currentTranslation: text }),
  setTranslating: (isTranslating) => set({ isTranslating }),
  setConfidenceScore: (score) => set({ confidenceScore: score }),
  setHistory: (history) => set({ history }),
  setSavedItems: (items) => set({ savedItems: items }),
  addToHistory: (translation) =>
    set((state) => ({
      history: [translation, ...state.history],
    })),
  clearCurrentTranslation: () =>
    set({
      currentTranslation: '',
      confidenceScore: 0,
    }),
}));
