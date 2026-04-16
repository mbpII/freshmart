import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DevModeState = {
  isManager: boolean;
  setIsManager: (value: boolean) => void;
};

export const useDevModeStore = create<DevModeState>()(
  persist(
    (set) => ({
      isManager: false,
      setIsManager: (value) => set({ isManager: value }),
    }),
    {
      name: 'freshmart.dev.isManager',
      partialize: (state) => ({ isManager: state.isManager }),
    },
  ),
);
