import { create } from 'zustand';

interface UpgradeModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useUpgradeModal = create<UpgradeModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

